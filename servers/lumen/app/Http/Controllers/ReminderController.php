<?php

namespace App\Http\Controllers;

use App\Reminder;
use Illuminate\Http\Request;
use Ramsey\Uuid\Uuid;
use DB;
use Predis\Autoloader;
\Predis\Autoloader::register();


class ReminderController extends Controller
{

    public function showAllReminders()
    {
        $remQuery = DB::select(DB::raw('SELECT *, uuid as serverSideRowUuid, UNIX_TIMESTAMP(ROW_START) as ROW_START, UNIX_TIMESTAMP(ROW_END) as ROW_END FROM rems FOR SYSTEM_TIME ALL order by ROW_START desc'));
        return response()->json($remQuery);
        // return response()->json(Reminder::all());
    }

    public function showOneReminder($id)
    {
        return response()->json(Reminder::find($id));
    }

    public function create(Request $request)
    {
        $requestData = $request->all();
        $uuid = Uuid::uuid4();

        $remData = array(
            'uuid' => $uuid,
            'ptUUID' => $requestData['data']['ptUUID'],
            'description' => $requestData['data']['description'],
            'recordChangedByUUID' => $requestData['data']['recordChangedByUUID']
        );
       
        $Reminder = Reminder::insertGetId($remData);

        $channel = 'MsgFromSktForRemToAdd';
        $message = array(
            'uuid' => $uuid,
            'description' => $requestData['data']['description'],
            'clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange' => $requestData['data']['clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange']
        );

        $redis = new \Predis\Client();
        $redis->publish($channel, json_encode($message));

        // $Reminder = Reminder::create($request->all());
        return response()->json($Reminder, 201);
    }

    public function update($id, Request $request)
    {
        $Reminder = Reminder::findOrFail($id);
        $Reminder->update($request->all());

        /**
         * Send data to socket
         */
        $requestData = $request->all();
        $channel = 'MsgFromSktForRemToChange';
        $message = array(
            'uuid' => $id,
            'description' => $requestData['description'],
            'clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange' => $requestData['clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange']
        );

        $redis = new \Predis\Client();
        $redis->publish($channel, json_encode($message));

        return response()->json($Reminder, 200);
    }

    public function discontinue($id, Request $request)
    {
        $Reminder = Reminder::findOrFail($id);
        $requestData = $request->all();

        if(isset($requestData['dNotes']) && !empty($requestData['dNotes']))
        {
            $updateData = array(
                'notes' => $requestData['dNotes']
            );
            $Reminder->update($updateData);
        }

        $Reminder->delete();

        /**
         * Send data to socket
         */
        $channel = 'MsgFromSktForRemToDiscontinue';
        $message = array(
            'uuid' => $id,
            'clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange' => $requestData['clientSideSocketIdToPreventDuplicateUIChangeOnClientThatRequestedServerForDataChange']
        );

        $redis = new \Predis\Client();
        $redis->publish($channel, json_encode($message));

        return response('Discontinued successfully', 200);
    }
}
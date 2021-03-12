<?php

namespace App\Http\Controllers;

use App\User;
use Illuminate\Http\Request;
use DB;
use Carbon\Carbon;
use Predis\Autoloader;
\Predis\Autoloader::register();

class UserController extends Controller
{

    public function get_user_detail($pPtUuid)
    {
        $userQueryResultObj = DB::select(DB::raw("SELECT *, round(UNIX_TIMESTAMP(ROW_START) * 1000) as ROW_START, round(UNIX_TIMESTAMP(ROW_END) * 1000) as ROW_END, UNIX_TIMESTAMP(dateOfBirthInMilliseconds) * 1000 as dateOfBirthInMilliseconds FROM sc_users.users WHERE serverSideRowUuid = '{$pPtUuid}' order by ROW_START desc"));

        return response()->json($userQueryResultObj);
    }

    public function get_user_dob($pPtUuid)
    {
        $user = DB::select(DB::raw("SELECT *, round(UNIX_TIMESTAMP(ROW_START) * 1000) as ROW_START, round(UNIX_TIMESTAMP(ROW_END) * 1000) as ROW_END,dateOfBirthInMilliseconds as dateOfBirth, trim(UNIX_TIMESTAMP(dateOfBirthInMilliseconds) * 1000)+0 as dateOfBirthInMilliseconds FROM sc_users.users WHERE serverSideRowUuid = '{$pPtUuid}' order by ROW_START desc"));

        $age ='';

        if($user[0]->dateOfBirth){
            $dob = $user[0]->dateOfBirth;
            $dobYear = Carbon::parse($dob)->format('Y');
            $dobMonth = Carbon::parse($dob)->format('m');
            $dobDay = Carbon::parse($dob)->format('d');
            $age = Carbon::createFromDate(intval($dobYear), intval($dobMonth), intval($dobDay))->diff(Carbon::now())->format('%y years'); //can you get full age: format('%y years, %m months and %d days')
            $user[0]->age = $age;
        }

        return response()->json($user);
    }

    public function update($pServerSideRowUuid, Request $pRequest)
    {
        $requestData = $pRequest->all();
        $name = User::findOrFail($pServerSideRowUuid);
        $name->update($requestData['data']);

        return response()->json($name, 200);
    }

    public function updateDateOfBirth($pServerSideRowUuid, Request $pRequest)
    {
        $requestData = $pRequest->all();
        $dateOfBirthInMilliseconds = (int)($requestData['data']['dateOfBirthInMilliseconds']);
        $recordChangedByUuid = $requestData['data']['recordChangedByUuid'];
        $recordChangedFromIPAddress = $this->get_client_ip();

        $user = DB::statement("UPDATE `sc_users`.`users` SET `dateOfBirthInMilliseconds` = FROM_UNIXTIME({$dateOfBirthInMilliseconds}/1000), `recordChangedByUuid` = '{$recordChangedByUuid}', `recordChangedFromIPAddress` = '{$recordChangedFromIPAddress}' WHERE `users`.`serverSideRowUuid` = '{$pServerSideRowUuid}'");

        return response()->json($user, 200);
    }

    public function get_client_ip() {
        $ipaddress = '';
        if (isset($_SERVER['HTTP_CLIENT_IP']))
            $ipaddress = $_SERVER['HTTP_CLIENT_IP'];
        else if(isset($_SERVER['HTTP_X_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_X_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_X_FORWARDED'];
        else if(isset($_SERVER['HTTP_FORWARDED_FOR']))
            $ipaddress = $_SERVER['HTTP_FORWARDED_FOR'];
        else if(isset($_SERVER['HTTP_FORWARDED']))
            $ipaddress = $_SERVER['HTTP_FORWARDED'];
        else if(isset($_SERVER['REMOTE_ADDR']))
            $ipaddress = $_SERVER['REMOTE_ADDR'];
        else
            $ipaddress = 'UNKNOWN';
        return $ipaddress;
    }
}
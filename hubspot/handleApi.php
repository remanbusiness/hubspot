<?php

$type = $_GET['type'] ?? null;
$token = $_GET['access_token'] ?? null;
$method = $_SERVER['REQUEST_METHOD'];
if($method =="GET"){
    if (!$token) {
        echo json_encode([
            "error" => "access_token is required"
        ]);
        exit;
    }
    if($type=='contacts'){
        $url = "http://localhost:8080/api/get-contact-required-fields";
    }elseif($type=='companies'){
        $url = "http://localhost:8080/api/get-company-required-fields";
    }else{
        echo json_encode([
            "error" => "Invalid URL"
        ]);
        exit;
    }
    
    $ch = curl_init($url);
    
    $data = json_encode([
        "access_token" => $token
    ]);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo json_encode([
            "error" => curl_error($ch)
        ]);
    } else {
        header("Content-Type: application/json");
        echo $response;
    }
    
    curl_close($ch);
} elseif($method=="POST"){
    $rawData = file_get_contents("php://input");
    $body = json_decode($rawData, true);
    $token_post = $body['access_token'] ?? $_POST['access_token'] ?? null;
    if (empty($body)) {
        echo json_encode([
            "error" => "Request body is empty or invalid JSON"
        ]);
        exit;
    }
    if (!$token_post) {
        echo json_encode([
            "error" => "access_token is required"
        ]);
        exit;
    }
    

    if($type=='contacts'){
        $url = "http://localhost:8080/api/create-contact";
    }elseif($type=='companies'){
        $url = "http://localhost:8080/api/create-company";
    }else{
        echo json_encode([
            "error" => "Invalid URL"
        ]);
        exit;
    }
    $transformedBody = ["allData" => []];
    foreach ($body as $key => $value) {
        $transformedBody["allData"][] = [
            "name" => $key,
            "value" => $value
        ];
    }
    $ch = curl_init($url);
    
    // $data = json_encode([
    //     "access_token" => $token
    // ]);
    
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json"
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($transformedBody));
    
    $response = curl_exec($ch);
    
    if (curl_errno($ch)) {
        echo json_encode([
            "error" => curl_error($ch) 
        ]);
    } else {
        header("Content-Type: application/json");
        echo $response;
    }
    
    curl_close($ch);
}
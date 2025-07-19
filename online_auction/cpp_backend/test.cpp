#include <iostream>
#include <cpr/cpr.h>
#include "crow.h"
#include <unordered_set>
#include <mutex>
#include <sqlite3.h>
#include <nlohmann/json.hpp>
using namespace std;
using namespace cpr;
using namespace crow;
using json = nlohmann::json;

/*
C++ should be used for handling concurrent requests and websocket connections
Real time bedding 
*/

static int callback(void *NotUsed, int argc, char **argv, char **azColName) {
    int i;
    for(i = 0; i<argc; i++) {
       printf("%s = %s\n", azColName[i], argv[i] ? argv[i] : "NULL");
    }
    printf("\n");
    return 0;
}

void updateBid(sqlite3*& db, char*& zErrMsg, int& rc,int &itemId,float &newBid){
    
    rc = sqlite3_open("db.sqlite3", &db);
    string sql;
    if( rc ){
        fprintf(stderr, "Can't open database: %s\n", sqlite3_errmsg(db));
        return;
    }else {
        fprintf(stderr, "Opened database successfully\n");
    }
    
    sql = "UPDATE auction_item set current_price = '" + to_string(newBid) + "' where id = " + to_string(itemId);
    const char* updateBidSql = sql.c_str(); 
    rc = sqlite3_exec(db, updateBidSql, callback, 0, &zErrMsg);
    
    if( rc != SQLITE_OK ) {
        fprintf(stderr, "SQL error: %s\n", zErrMsg);
        sqlite3_free(zErrMsg);
        return;
    } else {
        fprintf(stdout, "Update operation done successfully\n");
    }
    sqlite3_close(db);
}

int main(){

    crow::SimpleApp app;//Used to initialise CROW server  
    std::mutex mtx;;
    unordered_set<crow::websocket::connection*> users;
    unordered_set<int>set;

    sqlite3 *db;
    char *zErrMsg = 0;
    int rc;
    
    
    CROW_ROUTE(app, "/items").methods("GET"_method)
    ([&](const crow::request& req) {

        //The idea is to communicate with Django server and the front end using APIs
        auto request = cpr::Get(Url{"http://127.0.0.1:8000/auction/items/"});// This is python server
        crow::response res(request.text);
        res.set_header("Access-Control-Allow-Origin", "*"); // Allow all origins
        res.set_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization");

        return res;
    });

    CROW_WEBSOCKET_ROUTE(app, "/websocket")
    .onopen([&](crow::websocket::connection& conn){
        CROW_LOG_INFO << "New websocket connection"; 
        std::lock_guard<std::mutex> _(mtx);
        users.insert(&conn);
        set.insert(1); // testing how i can use this
       
    })
    .onclose([&](crow::websocket::connection& conn, const string& reason){
        std::lock_guard<std::mutex> _(mtx);
        CROW_LOG_INFO << "websocket connection closed: " << reason;
        users.erase(&conn);
    })
    .onmessage([&](crow::websocket::connection& conn, const string& data, bool is_binary){
        std::lock_guard<std::mutex> _(mtx);
        nlohmann::json jsonData;
        // Parse the JSON request data
        jsonData = nlohmann::json::parse(data);
        cout<<data;// This is a json  request from client and store this in database, 'db.sqlite3'
        int itemId = jsonData["item_id"].get<int>();
        float newBidPrice = jsonData["new_bid_price"].get<float>(); 
        updateBid(db, zErrMsg, rc, itemId, newBidPrice); 
        crow::json::wvalue jsonResponse;
        jsonResponse["message"] = "C++ Server received your request";
        for(auto & client:users){
            
            client->send_text( jsonData.dump());
           
        }
        //conn.send_text(jsonData.dump());
       
    });

    app.port(3333).multithreaded().run();
    return 0;
}
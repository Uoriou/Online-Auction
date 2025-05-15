import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync

class BidConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_group_name = "test"
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()
        print("WebSocket connected")
       
        #The message is not displayed on the front end  
        await self.send(text_data=json.dumps(
            {'type':'Connection Established',
             'message':'You are now connected'}
        ))
        
    async def receive(self,text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        self.send(text_data=json.dumps({
            'message': message
        }))
        
         #Broadcast the message to the group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'auction',
                'message': message
            }
        )

        
    async def auction(self,event):
        message = event['message']
        await self.send(text_data=json.dumps({
            'type':'chat',
            'message':message
                  
        }))
            
        
        
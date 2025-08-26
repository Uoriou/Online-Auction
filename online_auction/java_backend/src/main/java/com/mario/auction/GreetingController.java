package com.mario.auction;

import java.math.BigDecimal;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import com.mario.auction.repo.BidRepository;
import com.model.BidEntity;

@Controller
public class GreetingController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    private static final Logger log = LoggerFactory.getLogger(GreetingController.class);

    @Autowired
    private BidRepository bidRepository;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings") // Sends the response to the subscribers of /topic/greetings
    public Bids bids(Bids message) throws Exception {
        Thread.sleep(1000);
        // TODO; Update the bid price here which is broadcasted to the other clients 
        // Store in the database the bid price 
        log.info("Received message: {}", message.getItemId());
       
        BidEntity bidEntity = new BidEntity();
        bidEntity.setItemId(message.getItemId());
        bidEntity.setBidPrice(message.getBidPrice());
        BidEntity savedBid = bidRepository.save(bidEntity);// Save to the database
        //If saved successfully, broadcast to all subscribers
        return new Bids(savedBid.getItemId(),savedBid.getBidPrice()); // Return the message to be sent to the subscribers
    }


}
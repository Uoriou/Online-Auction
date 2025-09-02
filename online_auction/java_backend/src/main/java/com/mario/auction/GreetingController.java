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
        // TODO; Update the bid price by connecting to the Django backend 
        // TODO or connect directly to the database but do not update the price until the timer is up
        // Store in the database the bid price 
        log.info("Received message: {}", message.getItemId());

        //If saved successfully, broadcast to all subscribers
        return new Bids(message.getItemId(),message.getBidPrice()); // Return the message to be sent to the subscribers
    }

    @MessageMapping("/timerHello")
    @SendTo("/topic/timer") // Sends the response to the subscribers of /topic/greetings
    public Time time(Time time) throws Exception {
        log.info("Received message: {}", time.getTime());
        return new Time(time.getTime()); // Return the message to be sent to the subscribers

    }

}
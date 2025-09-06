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

    // Real time bid transaction message mapping
    @MessageMapping("/hello")
    @SendTo("/topic/greetings") // Sends the response to the subscribers of /topic/greetings
    public Bids bids(Bids message) throws Exception {
        Thread.sleep(1000);
        log.info("Received bid info: {}", message.getItemId());
        return new Bids(message.getItemId(),message.getBidPrice()); // Return the message to be sent to the subscribers
    }
    // Timer message mapping
    @MessageMapping("/timerHello")
    @SendTo("/topic/timer") // Sends the response to the subscribers of /topic/greetings
    public Time time(Time time) throws Exception {
        log.info("Received time info: {}", time.getTime());
        return new Time(time.getTime()); // Return the message to be sent to the subscribers
    }
    //Item status message mapping
    @MessageMapping("/itemStatus")
    @SendTo("/topic/status") // Sends the response to the subscribers of /topic/status
    public String itemStatus(String itemStatus) throws Exception {
        log.info("Received item status info: {}", itemStatus);
        return itemStatus; 
    }

}
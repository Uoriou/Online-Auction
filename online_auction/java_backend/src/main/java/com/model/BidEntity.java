
package com.model;

import jakarta.persistence.*;
import java.time.Instant;
//To map this class to a database table
@Entity
@Table(name = "bids")
public class BidEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String itemId;

    @Column(precision = 19, scale = 2)
    private String bidPrice;

    private Instant createdAt = Instant.now();

    public BidEntity() {}

    public BidEntity(String itemId, String bidPrice) {
        this.itemId = itemId;
        this.bidPrice = bidPrice;
    }

    public Long getId() {
        return id;
    }   
    public void setId(Long id) {
        this.id = id;
    }
    public String getItemId() {
        return itemId;
    }   
    public void setItemId(String itemId) {
        this.itemId = itemId; 
    }

    public String getBidPrice() {
        return bidPrice;
    }   
    public void setBidPrice(String bidPrice) {
        this.bidPrice = bidPrice;      
    }

}


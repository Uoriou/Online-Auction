package com.mario.auction;

public class Bids {

    private String itemId;
    private String bidPrice;

    public Bids() {
        
    }   
    public Bids(String itemId, String bidPrice) {
        this.itemId = itemId;
        this.bidPrice = bidPrice;
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

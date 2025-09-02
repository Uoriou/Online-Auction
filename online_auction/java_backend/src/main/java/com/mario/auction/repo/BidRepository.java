package com.mario.auction.repo;

import com.model.BidEntity; // Not com.mario.auction.BidEntity ?? 

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<BidEntity, Long> { // it was long instead of Sting
   BidEntity findByItemId(String itemId);
}


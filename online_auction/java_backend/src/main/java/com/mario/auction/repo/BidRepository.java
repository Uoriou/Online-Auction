package com.mario.auction.repo;

import com.model.BidEntity; // Not com.mario.auction.BidEntity ?? 
import org.springframework.data.jpa.repository.JpaRepository;

public interface BidRepository extends JpaRepository<BidEntity, Long> {}


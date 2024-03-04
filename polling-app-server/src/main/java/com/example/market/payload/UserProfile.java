package com.example.market.payload;

import lombok.Getter;
import lombok.Setter;

import java.time.Instant;

@Getter
@Setter
public class UserProfile {
    private Long id;
    private String username;
    private String name;

    private Instant joinedAt;
    private Long pollCount;
    private Long voteCount;

    public UserProfile(Long id, String username, String name) {
        this.id = id;
        this.username = username;
        this.name = name;
    }
}

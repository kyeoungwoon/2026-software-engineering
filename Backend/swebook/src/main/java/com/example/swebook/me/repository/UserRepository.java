package com.example.swebook.me.repository;

import com.example.swebook.me.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByOrderByUserIdAsc();
}

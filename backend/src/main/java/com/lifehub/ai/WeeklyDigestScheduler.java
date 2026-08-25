package com.lifehub.ai;

import com.lifehub.kafka.WeeklyDigestEventProducer;
import com.lifehub.model.User;
import com.lifehub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.IsoFields;
import java.util.List;

@Component
public class WeeklyDigestScheduler {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeeklyDigestEventProducer weeklyDigestEventProducer;

    @Scheduled(cron = "0 0 6 * * MON")
    public void requestWeeklyDigests() {
        LocalDate weekStart = LocalDate.now().minusWeeks(1).with(DayOfWeek.MONDAY);
        String weekKey = weekStart.get(IsoFields.WEEK_BASED_YEAR) + "-W"
                + String.format("%02d", weekStart.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));

        List<User> users = userRepository.findAll();
        for (User user : users) {
            weeklyDigestEventProducer.publish(user.getId(), weekStart, weekKey);
        }
    }
}

package com.objectcomputing.checkins.services.checkins;

import java.util.Set;
import java.util.UUID;

public interface CheckInServices {

    CheckIn save(CheckIn checkIn);

    CheckIn read(UUID id);

    Set<CheckIn> readAll();

    CheckIn update(CheckIn checkinNote);

    Set<CheckIn> findByFields(UUID teamMemberId, UUID pdlId);

    
}
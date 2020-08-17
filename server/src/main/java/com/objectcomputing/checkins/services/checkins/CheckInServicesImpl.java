package com.objectcomputing.checkins.services.checkins;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import javax.inject.Inject;

import com.objectcomputing.checkins.services.memberprofile.MemberProfileRepository;

public class CheckInServicesImpl implements CheckInServices {

    @Inject
    private CheckInRepository checkinRepo;

    @Inject
    private MemberProfileRepository memberRepo;
    
    @Override
    public CheckIn save(CheckIn checkIn) {
        CheckIn checkInRet = null;
        if(checkIn!=null){
            final UUID memberId = checkIn.getTeamMemberId();
            final UUID pdlId = checkIn.getPdlId();
        if(memberId==null){
            throw new CheckInBadArgException(String.format("Inavlid check in %s", checkIn));
        } else if(checkIn.getId()!=null){
            throw new CheckInBadArgException(String.format("Found unexpected id for checkin  %s", checkIn.getId()));
        } else if(memberId.equals(pdlId)){
            throw new CheckInBadArgException(String.format("Team member id %s can't be same as PDL id", checkIn.getTeamMemberId()));
        } else if(!memberRepo.findById(memberId).isPresent()){
            throw new CheckInBadArgException(String.format("Member %s doesn't exists", memberId));

        }
        checkInRet = checkinRepo.save(checkIn);
        }
            return checkInRet ;
    }


    @Override
    public CheckIn read(UUID id) {
        return checkinRepo.findById(id).orElse(null);
    }

    @Override
    public Set<CheckIn> readAll() {
        Set<CheckIn> checkIn = new HashSet<>();
        checkinRepo.findAll().forEach(checkIn::add);
        return checkIn ;
    }

    @Override
    public CheckIn update(CheckIn checkIn) {
        CheckIn checkInRet = null;
        if(checkIn!=null){
        final UUID id = checkIn.getId();
        final UUID memberId = checkIn.getTeamMemberId();
        if(id==null||!checkinRepo.findById(id).isPresent()){
            throw new CheckInBadArgException(String.format("Unable to find checkin record with id %s", checkIn.getId()));
        }else if(!memberRepo.findById(memberId).isPresent()){
            throw new CheckInBadArgException(String.format("Member %s doesn't exist", memberId));
        } else if(memberId==null) {
            throw new CheckInBadArgException(String.format("Invalid checkin %s", checkIn));
        }

        checkInRet = checkinRepo.update(checkIn);
        }        
        return checkInRet;
    }

    @Override
    public Set<CheckIn> findByFields(UUID teamMemberId, UUID pdlId) {
        Set<CheckIn> checkIn = new HashSet<>();
        checkinRepo.findAll().forEach(checkIn::add);
        if(teamMemberId!=null){
            checkIn.retainAll(checkinRepo.findByTeamMemberId(teamMemberId));
        } else if(pdlId!=null) {
            checkIn.retainAll(checkinRepo.findByPdlId(pdlId));
        }
        return checkIn;
    }
    
}
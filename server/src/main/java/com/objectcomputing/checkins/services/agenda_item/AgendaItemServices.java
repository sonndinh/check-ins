package com.objectcomputing.checkins.services.agenda_item;

import java.util.Set;
import java.util.UUID;

public interface AgendaItemServices {

    AgendaItem save(AgendaItem checkinNote);

    AgendaItem read(UUID id);

    AgendaItem update(AgendaItem checkinNote);

    Set<AgendaItem> findByFields(UUID checkinid, UUID createdbyid);

    void delete(UUID id);
}
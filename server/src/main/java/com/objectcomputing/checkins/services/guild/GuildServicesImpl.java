package com.objectcomputing.checkins.services.guild;

import com.objectcomputing.checkins.services.exceptions.BadArgException;

import javax.inject.Singleton;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

import static com.objectcomputing.checkins.util.Util.nullSafeUUIDToString;

@Singleton
public class GuildServicesImpl implements GuildServices {

    private final GuildRepository guildsRepo;

    public GuildServicesImpl(GuildRepository guildsRepo) {
        this.guildsRepo = guildsRepo;
    }

    public Guild save(@NotNull Guild guild) {
        Guild newGuild = null;
        if (guild != null) {
            if (guild.getId() != null) {
                throw new BadArgException(String.format("Found unexpected id %s, please try updating instead",
                        guild.getId()));
            } else if (guildsRepo.findByName(guild.getName()).isPresent()) {
                throw new BadArgException(String.format("Guild with name %s already exists", guild.getName()));
            } else {
                newGuild = guildsRepo.save(guild);
            }
        }

        return newGuild;
    }

    public Guild read(@NotNull UUID guildId) {
        return guildId != null ? guildsRepo.findById(guildId).orElse(null) : null;
    }

    public Guild update(@NotNull Guild guild) {
        Guild newGuild = null;
        if (guild != null) {
            if (guild.getId() != null && guildsRepo.findById(guild.getId()).isPresent()) {
                newGuild = guildsRepo.update(guild);
            } else {
                throw new BadArgException(String.format("Guild %s does not exist, can't update.", guild.getId()));
            }
        }

        return newGuild;
    }

    public Set<Guild> findByFields(String name, UUID memberid) {
        String likeName = null;
        if (name != null) {
            likeName = "%" + name + "%";
        }
        Set<Guild> guilds = new HashSet<>(
                guildsRepo.search(likeName, nullSafeUUIDToString(memberid)));

        return guilds;

    }

}

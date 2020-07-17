package com.objectcomputing.checkins.services.skills;

import edu.umd.cs.findbugs.annotations.NonNull;
import io.micronaut.data.jdbc.annotation.JdbcRepository;
import io.micronaut.data.model.query.builder.sql.Dialect;
import io.micronaut.data.repository.CrudRepository;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.UUID;

@JdbcRepository(dialect = Dialect.POSTGRES)
public interface SkillRepository extends CrudRepository<Skill, UUID> {

    Skill findBySkillid(UUID skillid);
    List<Skill> findByName(String name);
    List<Skill> findByNameIlike(String name);
    List<Skill> findByPending(boolean pending);

    @Override
    <S extends Skill> List<S> saveAll(@Valid @NotNull Iterable<S> entities);

    @Override
    <S extends Skill> S save(@Valid @NotNull @NonNull S entity);
}
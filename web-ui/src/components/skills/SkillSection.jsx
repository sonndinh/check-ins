import React, { useContext, useEffect, useState } from "react";

import "./SkillSection.css"

import {
  AppContext,
  ADD_SKILL,
  ADD_MEMBER_SKILL,
  DELETE_MEMBER_SKILL,
  UPDATE_MEMBER_SKILLS,
  selectMySkills,
} from "../../context/AppContext";
import { createMemberSkill, deleteMemberSkill, updateMemberSkill } from "../../api/memberskill.js";
import { getSkill, createSkill } from "../../api/skill.js";
import SkillSlider from "./SkillSlider"

import { Card, CardHeader, TextField } from "@material-ui/core";
import Autocomplete, { createFilterOptions } from "@material-ui/lab/Autocomplete";
import BuildIcon from '@material-ui/icons/Build';

import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'

const customBreakpointValues = {
  values: {
    xs: 0,
    sm: 360,
    md: 768,
    lg: 992,
    xl: 1200,
  },
}

const breakpoints = createBreakpoints({ ...customBreakpointValues })

const muiTheme = createMuiTheme({
  breakpoints: {
    ...customBreakpointValues,
  },
  overrides: {
    MuiCardHeader: {
      title:{
      [breakpoints.down('sm')]: {
        fontSize: "1.1rem",
        },
      [breakpoints.between('sm', 'md')]: {
        fontSize: "1.2rem",
        },
      [breakpoints.between('md', 'lg')]: {
        fontSize: "1.3rem",
        },
      [breakpoints.up('lg')]: {
        fontSize: "1.5rem",
        },
      }
    }
  }
});

const SkillSection = ({userId}) => {
  const { state, dispatch } = useContext(AppContext);
  const { csrf, skills } = state;
  const myMemberSkills = selectMySkills(state);
  const [mySkills, setMySkills] = useState([]);
  const [skillToAdd, setSkillToAdd] = useState();

  const mapMemberSkill = async (memberSkill, csrf) => {
    let thisSkill = await getSkill(memberSkill.skillid, csrf);
    thisSkill.lastuseddate = memberSkill.lastuseddate;
    thisSkill.skilllevel = memberSkill.skilllevel;
    return thisSkill;
  }

  useEffect(() => {
    const getSkills = async () => {
      const skillsResults = await Promise.all(
        myMemberSkills.map((mSkill) => mapMemberSkill(mSkill, csrf))
      );
      const currentUserSkills = skillsResults.map(
        (result) => {
          let skill = result.payload.data;
          skill.skilllevel = result.skilllevel;
          skill.lastuseddate = result.lastuseddate;
          return skill;
        }
      );
      setMySkills(currentUserSkills);
    };
    if (csrf && myMemberSkills) {
      getSkills();
    }
  }, [csrf, myMemberSkills]);

  const addSkill = async (name) => {
    console.log(name);
    if (!csrf) {
      return;
    }
    const inSkillsList = skills.find(
      (skill) => skill.name.toUpperCase() === name.toUpperCase()
    );
    let curSkill = inSkillsList;
    if (!inSkillsList) {
      const res = await createSkill({ name: name, pending: true }, csrf);
      const data =
        res && res.payload && res.payload.data ? res.payload.data : null;
      data && dispatch({ type: ADD_SKILL, payload: data });
      curSkill = data;
    }
    if (curSkill && curSkill.id && userId) {
      if (
        Object.values(mySkills).find(
          (skill) => skill.name.toUpperCase === curSkill.name.toUpperCase()
        )
      ) {
        return;
      }
      const res = await createMemberSkill(
        { skillid: curSkill.id, memberid: userId },
        csrf
      );
      const data =
        res && res.payload && res.payload.data ? res.payload.data : null;
      data && dispatch({ type: ADD_MEMBER_SKILL, payload: data });
    }
  };

  const removeSkill = async (id, csrf) => {
    const mSkill = myMemberSkills.find((s) => s.skillid === id);
    await deleteMemberSkill(mSkill.id, csrf);
    dispatch({ type: DELETE_MEMBER_SKILL, payload: id });
  };

  const handleDelete = (id) => {
    if (csrf && id) {
      removeSkill(id, csrf);
    }
  };

  const handleUpdate = async (lastUsedDate, skillLevel, index) => {
    if (csrf && skillLevel) {
        let copy = [...myMemberSkills];
        copy[index].lastuseddate = lastUsedDate;
        copy[index].skilllevel = skillLevel;
        await updateMemberSkill(copy[index], csrf);
        dispatch({ type: UPDATE_MEMBER_SKILLS, payload: copy });
    }
  };
  const filter = createFilterOptions();

  const SkillSelector = (props) => (
    <Autocomplete
        value={skillToAdd}
        style={{width:"18em"}}
        id="skillSearchAutocomplete"
        selectOnFocus
        clearOnBlur={true}
        handleHomeEndKeys
        blurOnSelect
        options={
          skills
            .filter((skill) =>
                !mySkills.map((mSkill) => mSkill.id).includes(skill.id))
            .map((skill) => {
              return {
                displayLabel: skill.name,
                name: skill.name
              }
            })
        }
        renderOption={(option) => option.displayLabel}

        filterOptions={(options, params) => {
          const filtered = filter(options, params);

          if (params.inputValue !== '') {
            filtered.push({
              name: params.inputValue,
              displayLabel: `Add "${params.inputValue}"`,
            });
          };
          return filtered;
        }}

        renderInput={(params) => (
          <TextField
            {...params}
            className="fullWidth"
            label="Add a skill..."
            placeholder="Enter a skill name"
          />
        )}

        onChange={(event, value) => {
          addSkill(value.name);
          setSkillToAdd(undefined);
        }}

        getOptionLabel={(option) => option.displayLabel || ""}
      />
  );

  return (
  <ThemeProvider theme={muiTheme}>
      <Card>
        <CardHeader
            avatar={<BuildIcon />}
            title="Skills"
            titleTypographyProps={{variant: "h5", component: "h2"}}
            action={<SkillSelector />}/>
        {mySkills &&
          mySkills.map((memberSkill, index) => {
            return (
              <SkillSlider
                key={memberSkill.id}
                id={memberSkill.id}
                name={memberSkill.name}
                startLevel={memberSkill.skilllevel ? memberSkill.skilllevel : 3}
                lastUsedDate={memberSkill.lastuseddate}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                index={index}
              />
            );
          })}
      </Card>
      </ThemeProvider>
  );

};
export default SkillSection;
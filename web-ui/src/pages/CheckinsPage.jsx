import React, { useContext, useEffect, useState } from "react";

import ActionItemsPanel from "../components/action_item/ActionItemsPanel";
import AgendaItems from "../components/agenda/Agenda";
import { AppContext } from "../context/AppContext";
import CheckinDocs from "../components/checkin/documents/CheckinDocs";
import CheckinsHistory from "../components/checkin/CheckinHistory";
import Profile from "../components/profile/Profile";
import GuidesPanel from "../components/guides/GuidesPanel";
import PDLGuidesPanel from "../components/guides/PDLGuidesPanel";
import Note from "../components/notes/Note";
import PrivateNote from "../components/private-note/PrivateNote";
import Personnel from "../components/personnel/Personnel";

import { Button, Grid, Modal } from "@material-ui/core";

import "./CheckinsPage.css";
import {updateCheckin} from "../api/checkins";

const CheckinsPage = ({ history }) => {
  const [open, setOpen] = useState(false);
  const { state } = useContext(AppContext);
  const { currentCheckin, userProfile, selectedProfile, csrf } = state;
  const isAdmin =
      userProfile && userProfile.role && userProfile.role.includes("ADMIN");
  const memberProfile = userProfile ? userProfile.memberProfile : undefined;
  const id = memberProfile && memberProfile.id ? memberProfile.id : undefined;
  const canSeePersonnel =
    userProfile && userProfile.role && userProfile.role.includes("PDL");
  const canViewPrivateNote =
    isAdmin || (memberProfile && currentCheckin && id !== currentCheckin.teamMemberId);

  const handleOpen = () => setOpen(true);

  const handleClose = () => setOpen(false);

  const completeCheckin = async () => {
    if (csrf) {
      await updateCheckin({...currentCheckin, completed: true}, csrf);
    }
    handleClose();
  };

  useEffect(() => {
    if (currentCheckin && currentCheckin.id) {
      history.push(`/checkins/${currentCheckin.id}`);
    }
  }, [currentCheckin, history]);

  return (
    <div style={{padding:12}}>
    <Grid container spacing={3} >
      <Grid item sm={9} justify="center">
        <div className="contents">
          <Profile memberId={selectedProfile?.id || id} />
          <CheckinsHistory history={history} />
          {currentCheckin && currentCheckin.id && (
            <React.Fragment>
              <AgendaItems
                checkinId={currentCheckin.id}
                memberName={
                  selectedProfile
                    ? selectedProfile.name
                    : userProfile.name
                }
              />
              <ActionItemsPanel
                checkinId={currentCheckin.id}
                memberName={
                  selectedProfile
                    ? selectedProfile.name
                    : userProfile.name
                }
              />
              <Note
                memberName={
                  selectedProfile
                    ? selectedProfile.name
                    : userProfile.name
                }
              />
              {canViewPrivateNote && (
              <PrivateNote
                memberName={
                  selectedProfile
                    ? selectedProfile.name
                    : userProfile.name
                }
              />
              )}
              <CheckinDocs />
            </React.Fragment>
          )}
        </div>
        {canViewPrivateNote && (
          <div className="modal-container">
            <Modal open={open} close={handleClose}>
              <div className="submit-checkin-modal">
                The Check-In will no longer be able to be edited. Are you
                sure that you are ready to close this Check-In?
                <div className="submit-modal-actions">
                  <Button onClick={handleClose} color="secondary">
                    Cancel
                  </Button>
                  <Button
                      color="primary"
                      onClick={completeCheckin}
                  >
                    Complete and Close
                  </Button>
                </div>
              </div>
            </Modal>
            <Button
              color="primary"
              onClick={handleOpen}
              variant="contained"
            >
              Complete and Close Checkin
            </Button>
          </div>
        )}
      </Grid>
      <Grid item sm={3} justify="flex-end">
          <div className="right-sidebar">
            {canSeePersonnel && <Personnel history={history} />}
            <GuidesPanel />
            <PDLGuidesPanel />
          </div>
      </Grid>
    </Grid>
    </div>
  );
};

export default CheckinsPage;

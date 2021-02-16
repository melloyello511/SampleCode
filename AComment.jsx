import React, { useState } from "react";
import debug from "sabio-debug";
import { Formik, Form } from "formik";
import {
  Grid,
  Card,
  TextField,
  Divider,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import propTypes from "prop-types";
import CustomizedRatings from "../../pages/ratings/CustomizedRating";
import format from "date-fns/format";
import * as commentsService from "@services/commentsService";
import commentsSchema from "../../schema/commentsSchema";

const _logger = debug.extend("AComment");
function AComment({ comment }) {
  _logger(comment, "Comment Rendering");

  const nestedComments = (comment) => (
    <AComment key={comment.id} comment={comment} type="child" />
  );
  const [open, setOpen] = React.useState(false);
  const [values, setValues] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (values) => {
    commentsService.create(values);
    // .then(this.onActionSuccess)
    // .catch(this.onActionError);
    //un-used to submit reply -- not done yet
  };

  const renderRating = () => {
    if (comment.entityType.id !== 2) {
      return (
        <div className="my-6 mb-3">
          <CustomizedRatings value={comment.rating} />
        </div>
      );
    }
    return null;
  };
  return (
    <Formik
      enableReinitialization={true}
      validationSchema={commentsSchema}
      onSubmit={handleSubmit}
      initialValues={""}
    >
      <Grid container spacing={0}>
        <Grid item xs={1}></Grid>
        <Grid item xs={10}>
          <div className="p-4 mb-4" style={{ backgroundColor: "#FAFAFA" }}>
            <div className="d-flex align-items-center">
              <div className="avatar-icon-wrapper rounded mr-3">
                <img
                  className="avatar-icon border-2 border-white rounded"
                  src={comment.avatarUrl}
                  alt="avatar"
                />
              </div>
              <div className="w-100">
                <div
                  className="font-size-small font-weight-bold"
                  alt="firstName"
                >
                  {comment.firstName + " " + comment.lastName}
                </div>
              </div>
            </div>
            <div>
              <Form>
                <TextField
                  fullWidth={true}
                  multiline={true}
                  rows="1"
                  rowsMax="35"
                  required={true}
                  className="mb-3"
                  id="text"
                  name="text"
                  value={comment.text}
                />
              </Form>
            </div>
            {renderRating()}
            <div className="mb-3">
              <small className="text-black-50 pt-1 d-block">
                Created on:{" "}
                <b className="text-first">
                  {format(new Date(comment.dateCreated), "MM/dd/yyyy")}
                </b>
              </small>
            </div>
            <div className="text-center">
              <Button
                color="primary"
                variant="outlined"
                fullWidth={false}
                type="submit"
                onClick={handleClickOpen}
              >
                Reply
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="form-dialog-title"
              >
                <DialogTitle id="form-dialog-title">Reply</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {" "}
                    _________________________________________________________________
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="reply"
                    placeholder="So what do you think?"
                    label="Leave a reply here"
                    type="text"
                    fullWidth={true}
                    multiline={true}
                    value={values}
                    //onChange={handleChange}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} color="primary" type="submit">
                    Submit
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </Grid>
        <Grid item xs={2}></Grid>
        <Grid item xs={10}>
          {comment.replies && comment.replies.map(nestedComments)}
        </Grid>
      </Grid>
    </Formik>
  );
}
AComment.propTypes = {
  children: propTypes.node,
  comment: propTypes.shape({
    id: propTypes.number.isRequired,
    text: propTypes.string.isRequired,
    firstName: propTypes.string.isRequired,
    lastName: propTypes.string.isRequired,
    avatarUrl: propTypes.string,
    rating: propTypes.number.isRequired,
    entityType: propTypes.shape({
      id: propTypes.number.isRequired,
      name: propTypes.string.isRequired,
    }),
    rating: propTypes.number.isRequired,
    dateCreated: propTypes.string.isRequired,
    replies:
      propTypes.object &
      propTypes.array &
      propTypes.shape({
        text: propTypes.string.isRequired,
        firstName: propTypes.string.isRequired,
        lastName: propTypes.string.isRequired,
        avatarUrl: propTypes.string,
      }),
  }),
  replies: propTypes.func,
  history: propTypes.shape({
    push: propTypes.func,
  }),
};
export default React.memo(AComment);

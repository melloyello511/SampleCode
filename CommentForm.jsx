//we'll be implementing login user functionality after this pull request
import React from "react";
import logger from "sabio-debug";
import { Formik, Form } from "formik";
import * as commentsService from "@services/commentsService";
import { Grid, TextField, Divider, Button, Snackbar } from "@material-ui/core";
import { IconButton, Tooltip } from "@material-ui/core";
import commentsSchema from "../../schema/commentsSchema";
import CustomizedRatings from "../../pages/ratings/CustomizedRating";
import * as ratingService from "@services/ratingService";
import PropTypes from "prop-types";
import Alert from "../../assets/components/Alert";
const _logger = logger.extend("CommentForm");
class CommentForm extends React.Component {
  constructor(props) {
    super(props);
    //const currentUser = localStorage.getItem("currentUser");
    this.state = {
      snackBarShow: false,
      severity: "success",
      barMessage: "",
    //  currentUser: JSON.parse(currentUser),
      formData: {
        text: "",
        parentId: 0,
        entityTypeId: 4,
        entityId: 4,
        isDeleted: false,
        rating: 0,
      },
      open: false,
      values: {},
    };
  }

  handleClose = () => {
    this.setState((prevState) => {
      return {
        ...prevState,
        snackbarShow: false,
      };
    });
  };

  handleSubmit = (values) => {
    _logger(values, "Submit was clicked");

    this.setState((prevState) => {
      return { ...prevState, values: values };
    });

    commentsService
      .create(values)
      .then(this.onActionSuccess)
      .catch(this.onActionError);
  };
  
  onActionSuccess = (response) => {
    _logger(response, "Comment Posted");
    debugger

    let newComment = {
      id: response.item,
      parentId: this.state.values.parentId,
      entityId: this.state.values.entityId,
      entityType: {
        id: this.state.values.entityTypeId,
        name: "Provider",
      },
      isDeleted: this.state.values.isDeleted,
      rating: this.state.values.rating,
      text: this.state.values.text,
      //we have to get userData based on their login and push that either into history, into state for props
      //or into local stored Data (Max's method).
      //for now I'm hard coding though
      avatarUrl:
        "https://3.bp.blogspot.com/-NwnU5pU3PnQ/UBfrYIQKWxI/AAAAAAAAG_I/0Wqv_ByYF4A/s1600/Tom+And+Jerry+Wallpapers+9.jpg",
      createdBy: 15,
      dateCreated: "2021-01-29T21:30:19.21",
      dateModified: "2021-01-29T21:30:19.21",
      firstName: "Keanu",
      lastName: "test",
    };

    this.props.updateParentCommentState(newComment);

    this.setState((prevState) => {
      return {
        ...prevState,
        snackbarShow: true,
        barMessage: "Your Comment Has Been Posted",
        severity: "success",
      };
    });

    const commentId = response.item;
    const { entityTypeId, entityId, rating } = this.state.formData;
   // const { id } = this.state.currentUser;
    debugger
    const params = {
      commentId: commentId,
      entityTypeId: entityTypeId,
      entityId: entityId,
      createdBy: 15,
      rating: rating,
    };
    debugger
    ratingService
      .postRating(params)
      .then(this.postRatingSuccess)
      .catch(this.postRatingError);
  };
  onActionError = (err) => {
    _logger(err, "Submit Error");
    this.setState((prevState) => {
      return {
        ...prevState,
        snackbarShow: true,
        barMessage: "There was a problem submitting your comment",
        severity: "error",
      };
    });
  };
  onRatingChange = (event, newValue) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        formData: {
          ...prevState.formData,
          rating: newValue,
        },
      };
    });
  };
  postRatingSuccess = (response) => {
    debugger
    _logger("PostRating success", response);
  };
  postRatingError = (err) => {
    _logger("Post rating err", err);
  };
  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize={true}
          validationSchema={commentsSchema}
          initialValues={this.state.formData}
          onSubmit={this.handleSubmit}
        >
          {(props) => {
            const {
              values,
              touched,
              errors,
              handleSubmit,
              handleChange,
              isValid,
              isSubmitting,
            } = props;
            return (
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <div
                    className="p-4 mb-4"
                    style={{ backgroundColor: "#FAFAFA" }}
                  >
                    <div className="d-flex align-items-center"></div>
                    <div>
                      <Form onSubmit={handleSubmit}>
                        <TextField
                          fullWidth={true}
                          multiline={true}
                          rows="1"
                          rowsMax="35"
                          required={true}
                          placeholder="What's on your mind?"
                          className="mb-3"
                          id="text"
                          name="text"
                          label="Leave a comment here"
                          value={values.text}
                          onChange={handleChange}
                          error={touched.text && Boolean(errors.text)}
                          helperText={touched.text && errors.text}
                        />
                        <div className="my-6 mb-3">
                          <CustomizedRatings
                            value={this.state.formData.params}
                            onChange={this.onRatingChange}
                          />
                        </div>

                        <div className="card-header--actions text-center">
                          <Tooltip
                            placement="bottom"
                            title="You can only add a review once!"
                            arrow
                          >
                            <IconButton size="medium" color="primary">
                              <div className="text-center">
                                <Button
                                  color="secondary"
                                  variant="contained"
                                  fullWidth={false}
                                  type="submit"
                                  disabled={!isValid || isSubmitting}
                                >
                                  Submit
                                </Button>
                              </div>
                            </IconButton>
                          </Tooltip>
                        </div>
                      </Form>
                    </div>
                  </div>
                </Grid>
              </Grid>
            );
          }}
        </Formik>
        <Snackbar
          open={this.state.snackbarShow}
          autoHideDuration={3000}
          onClose={this.handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity={this.state.severity}>{this.state.barMessage}</Alert>
        </Snackbar>
      </React.Fragment>
    );
  }
}
CommentForm.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  updateParentCommentState: PropTypes.func,
};
export default CommentForm;

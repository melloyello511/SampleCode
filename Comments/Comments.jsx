import React from "react";
import debug from "sabio-debug";
import * as commentsService from "@services/commentsService";
import { Grid } from "@material-ui/core";
import CommentForm from "./CommentForm";
import AComment from "./AComment";
import CountUp from "react-countup";
import CustomizedRatings from "../../pages/ratings/CustomizedRating";
import PropTypes from "prop-types";
const _logger = debug.extend("Comments", "ERROR");
class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allComments: [],
      mappedComments: [],
      childComments: [],
      firstName: "",
      lastName: "",
      avatarUrl: "",
      entityTypeId: 4,
      entityId: 4,
      totalRating: 0,
      averageRating: 0,
    };
  }
  componentDidMount() {
    commentsService
      .getByEntity(this.state.entityTypeId, this.state.entityId)
      .then(this.onGetByEntitySuccess)
      .catch(this.onGetByEntityError);
  }

  updateParentCommentState = (newComment) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        parentComments: this.state.parentComments.unshift(newComment),
      };
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.parentComments !== this.state.parentComments) {
      if (typeof this.state.parentComments === "number") {
        this.combineCommentsReplies(prevState.parentComments);
      } else {
        this.combineCommentsReplies(this.state.parentComments);
      }
    }
  }

  combineCommentsReplies = (allComments) => {
    let parentComments = allComments.filter(
      (allComment) => !allComment.parentId
    );
    let childComments = allComments.filter(
      (allComment) => allComment.parentId > 0
    );

    for (let myIndex = 0; myIndex < parentComments.length; myIndex++) {
      const parentComment = parentComments[myIndex];
      parentComment.replies = parentComment.replies || [];
      for (
        let childIndex = 0;
        childIndex < childComments.length;
        childIndex++
      ) {
        const childComment = childComments[childIndex];
        if (childComment.parentId === parentComment.id) {
          parentComment.replies.push(childComment);
        }
      }
    }
    const totalRating = allComments.reduce((total, comment) => {
      return (total += comment.rating);
    }, 0);
    let averageRating = totalRating / allComments.length;
    if (!Number.isInteger(averageRating)) {
      averageRating = averageRating.toFixed(2);
    }
    this.setState((prevState) => {
      return {
        ...prevState,
        allComments,
        totalRating,
        averageRating,
        mappedComments: parentComments.map(this.mapComment),
      };
    });
  };

  onGetByEntitySuccess = (response) => {
    let allComments = response.items;
    _logger(allComments, "GetByEntity Fired");

    this.setState(() => {
      return {
        parentComments: response.items,
      };
    });
  };
  onGetByEntityError = (err) => {
    _logger(err, "ERROR");
  };
  mapComment = (oneComment) => (
    <AComment comment={oneComment} key={oneComment.id} />
  );
  renderTotalRating = () => {
    if (this.props.showTotalRating) {
      return (
        <div className="d-flex justify-content-center align-items-center text-center mb-5 mt-5">
          <div className="d-flex">
            <div className="mr-2 font-size-lg text-black font-weight-bold">
              {this.state.averageRating}
            </div>
            <CustomizedRatings value={this.state.averageRating} readOnly />
          </div>
          <div className="font-size-lg text-black font-weight-bold">
            <CountUp
              start={0}
              end={this.state.totalRating}
              duration={3}
              deplay={2}
              separator=""
              decimals={0}
            />
            <span>&nbsp;&nbsp;Total Ratings</span>
          </div>
        </div>
      );
    }
    return null;
  };
  render() {
    return (
      <React.Fragment>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <div className="p-4 mb-4" style={{ backgroundColor: "#FAFAFA" }}>
              <div className="text-uppercase py-3 py-xl-4 text-black d-block text-center font-weight-bold font-size-lg">
                Comments
              </div>
              <hr className="MuiDivider-root mb-3" />
              {this.renderTotalRating()}
              <div className="row">
                <CommentForm
                  {...this.props}
                  updateParentCommentState={this.updateParentCommentState}
                />
              </div>
              <div className="row">{this.state.mappedComments}</div>
            </div>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}
Comments.propTypes = {
  showTotalRating: PropTypes.bool,
};
Comments.defaultProps = {
  showTotalRating: false,
};
export default Comments;

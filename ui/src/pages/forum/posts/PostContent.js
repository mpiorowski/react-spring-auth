import React, {Component} from 'react';
import moment from "moment";
import {Button, Comment, Divider, Dropdown, Icon, Menu, Tooltip} from "antd";
import ReactHtmlParser from "react-html-parser";
import './PostContent.less';

class PostContent extends Component {

  render() {

    const {openReplyArray, hoverCommentId, currentUser, post, mapPosts, postReplies} = this.props;

    let postCreated = moment(post.createdAt);
    let postUpdated = moment(post.updatedAt);
    let actions = [
      <span><Button className={'post-actions'} type="link" size={"small"} onClick={() => this.props.newPost(post.uid)}>Odpowiedz</Button></span>
    ];

    const postDatetime =
      <div>
        <Tooltip title={postCreated.format('YYYY-MM-DD HH:mm:ss')}>
          <span>{postCreated.fromNow()}</span>
        </Tooltip>
        {postUpdated.isSame(postCreated) ? '' :
          <span> | <span
            className={'post-updated'}>Edytowano: {postUpdated.format('YYYY-MM-DD HH:mm:ss')}</span></span>
        }
      </div>;
    const createDropdownMenu = (data, postUid) => {
      data = {
        ...data,
        replyUid: postUid || null,
      };
      return (
        <Menu>
          <Menu.Item onClick={() => this.props.editPost(data)} key="1">Edytuj</Menu.Item>
          {/*<Menu.Item key="2">Usuń</Menu.Item>*/}
        </Menu>
      )
    };

    //TODO - READY FOR MULTI RESPONSE, JUST ADD BTN
    let createReplies = (postUid) => {
      return [...postReplies.get(postUid).values()].map((replyUid) => {

        let moreReplies = [];
        let reply = mapPosts.get(replyUid);
        let replyCreated = moment(reply.createdAt);
        let replyUpdated = moment(reply.updatedAt);

        let replyAction = [
          <span><Button className={'post-actions'} type="link" size={"small"} onClick={() => this.props.newPost(replyUid)}>Odpowiedz</Button></span>
        ];

        if (postReplies.get(replyUid)) {

          //todo - wrong count for more replies
          const repliesCount = postReplies.get(post.uid).length;

          if (openReplyArray.includes(replyUid)) {
            moreReplies = createReplies(replyUid);
            replyAction.push(
              <span>
              <Button size={"small"}
                      type="link"
                      className={'post-actions'}
                      onClick={() => this.props.closeReply(replyUid)}>Ukryj odpowiedzi ({repliesCount}) <Icon
                type="caret-up"/></Button>
            </span>
            );
          } else {
            replyAction.push(
              <span>
              <Button size={"small"}
                      type="link"
                      className={'post-actions'}
                      onClick={() => this.props.openReply(replyUid)}>Pokaż odpowiedzi ({repliesCount}) <Icon
                type="caret-down"/></Button>
            </span>
            );
          }
        }

        const replyDatetime =
          <div>
            <Tooltip title={replyCreated.format('YYYY-MM-DD HH:mm:ss')}>
              <span>{replyCreated.fromNow()}</span>
            </Tooltip>
            {replyUpdated.isSame(replyCreated) ? '' :
              <span> | <span
                className={'post-updated'}>Edytowano: {replyUpdated.format('YYYY-MM-DD HH:mm:ss')}</span></span>
            }
          </div>;
        return (
          <div className={'post-reply-comment'} key={reply.uid} id={reply.uid}>
            {(hoverCommentId === reply.uid && currentUser.userName === reply.postAuthor.userName) ?
              <Dropdown overlay={() => {
                let data = {
                  ...reply,
                  replyUid: postUid || null,
                };
                return (
                  <Menu>
                    <Menu.Item onClick={() => this.props.editPost(data)} key="1">Edytuj</Menu.Item>
                    {/*<Menu.Item key="2">Usuń</Menu.Item>*/}
                  </Menu>
                )
              }} placement="bottomRight"
                        trigger={['click']}>
                <Button className={'post-more-btn'} type={'link'}><Icon type="more"/></Button>
              </Dropdown> : ''
            }
            <Comment
              author={<span className={'post-author'}>{reply.postAuthor.userName}</span>}
              // content={ReactHtmlParser(reply.postContent)}
              content={<span className={'post-content-span'}>{reply.postContent}</span>}
              datetime={replyDatetime}
              onMouseEnter={() => this.props.handleMouseHover(reply.uid)}
              // todo - for more replies uncomment
              // actions={replyAction}

            >
              {moreReplies}
            </Comment>
          </div>)
      });
    };

    let replies = [];
    if (postReplies.get(post.uid) && postReplies.get(post.uid).length > 0) {
      const repliesCount = postReplies.get(post.uid).length;
      if (openReplyArray.includes(post.uid)) {
        replies = createReplies(post.uid);
        actions.push(
          <span>
              <Button size={"small"}
                      type="link"
                      className={'post-actions'}
                      onClick={() => this.props.closeReply(post.uid)}>Ukryj odpowiedzi ({repliesCount}) <Icon
                type="caret-up"/></Button>
            </span>
        );
      } else {
        actions.push(
          <span>
              <Button size={"small"}
                      type="link"
                      className={'post-actions'}
                      onClick={() => this.props.openReply(post.uid)}>Pokaż odpowiedzi ({repliesCount}) <Icon
                type="caret-down"/></Button>
            </span>
        );
      }
    }


    return (
      <div key={post.uid} id={post.uid} className={'post-content'}>
        {(hoverCommentId === post.uid && currentUser.userName === post.postAuthor.userName) ?
          <Dropdown overlay={() => createDropdownMenu(post)} placement="bottomRight" trigger={['click']}>
            <Button className={'post-more-btn'} type={'link'}><Icon type="more"/></Button>
          </Dropdown> : ''
        }
        <Comment
          actions={actions}
          author={<span className={'post-author'}>{post.postAuthor.userName}</span>}
          content={
            <span className={'post-content-span'}>{ReactHtmlParser(post.postContent)}</span>
          }
          datetime={postDatetime}
          className={'post-comment'}
          onMouseEnter={() => this.props.handleMouseHover(post.uid)}
        >
        </Comment>
        <div className={'post-reply'}>
          {replies}
        </div>
        <Divider style={{padding: 0, margin: 0}}/>
      </div>
    );
  }
}

export default PostContent;

import React, {Component} from 'react';
import {Icon, Table} from "antd";
import "./TopicsComponent.less";
import {serviceAddTopic, serviceGetTopics} from "../../../services/forum/ForumService";
import moment from "moment";
import {NavLink} from "react-router-dom";
import {WrappedTopicDrawer} from "./TopicDrawer";


class TopicsComponent extends Component {

  state = {
    topics: [{
      uid: '',
      topicTitle: '',
      topicViews: '',
      postsCount: '',
    }],
    loading: true,
    categoryUid: null,
    category: null,
    drawerRecord: {},
    drawerType: '',
    paginationSize: null,
  };

  componentDidMount() {

    const {match: {params}} = this.props;
    let paginationSize = Math.round((window.innerHeight - 280) / 60);

    serviceGetTopics(params.categoryUid).then(response => {
      console.log(response);
      this.setState({
        topics: response.topics,
        category: response.category,
        loading: false,
        categoryUid: params.categoryUid,
        paginationSize: paginationSize
      });
    });
  }

  submitDrawer = (data) => {
    const categoryUid = this.state.categoryUid;
    const topicData = {topicTitle: data.title, topicDescription: data.content};
    serviceAddTopic(categoryUid, topicData).then(response => {
      if (response) {
        this.props.history.push('/forum/categories/' + categoryUid + '/topics/' + response.topicUid + "/posts");
      }
    }).catch(error => {
      console.log(error);
    });
  };

  handleDrawerVisible = (flag, record, type) => {
    this.setState({
      drawerVisible: !!flag,
      drawerRecord: record || {},
      drawerType: type
    });
  };

  render() {

    const {category, topics, loading, drawerVisible, drawerRecord} = this.state;

    const columns = [
        {
          title: 'Temat',
          dataIndex: 'topicTitle',
          key: 'topicTitle',
          width: '70%',
          sorter: (a, b) => a.topicTitle.localeCompare(b.topicTitle),
          render: (text, row, index) => {
            return <NavLink
              to={"/forum/categories/" + this.state.categoryUid + "/topics/" + row.uid + "/posts"}>{text}</NavLink>
          }
        },
        {
          title: 'Posty',
          dataIndex: 'postsCount',
          key: 'postsCount',
          align: 'center',
          sorter: (a, b) => a.postsCount - b.postsCount,
        },
        {
          title: 'Najnowszy',
          dataIndex: 'newestPost.newestDate',
          key: 'newest',
          align: 'center',
          sorter: (a, b) => {
            let startDate = a.newestPost ? moment(a.newestPost.newestDate) : moment(0);
            let endDate = b.newestPost ? moment(b.newestPost.newestDate) : moment(0);
            return startDate.diff(endDate);
          },
          render: (text, row, index) => {
            return text ? moment(text).fromNow() : 'Brak postów'
          }
        },
      ]
    ;

    return (
      <div>

        <div
          className={'cat-header'}>{category ? category.categoryTitle : ''}
        </div>

        <Table
          columns={columns}
          dataSource={topics}
          onChange={this.handleChange}
          size='middle'
          loading={loading}
          className={'topic-table'}
          rowKey={record => record.uid}
        />
        <div className="forum-floating-drawer-btn-initial" hidden={drawerVisible}
             onClick={() => this.handleDrawerVisible(true, {}, 'new', 'Dodaj nowy temat')}
        >
          <Icon type="plus"/>
        </div>
        <WrappedTopicDrawer

          drawerTitle={'Dodaj nowy temat'}
          drawerPlaceholder={'Temat (maks 300 znaków)'}
          drawerVisible={drawerVisible}
          drawerRecord={drawerRecord}
          drawerType={'topic'}

          handleDrawerVisible={this.handleDrawerVisible}
          submitDrawer={this.submitDrawer}
        />
      </div>

    );
  }
}

export default TopicsComponent;

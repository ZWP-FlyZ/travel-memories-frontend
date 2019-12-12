import React from 'react'
import {Button, Col, Input, message, Row,Empty,List,Card} from "antd";
import './MediaInfoBoxComponent.css'

class MediaInfoBoxComponent extends React.Component{

        datasource=["http://file02.16sucai.com/d/file/2014/0704/e53c868ee9e8e7b28c424b56afe2066d.jpg",
            'http://b-ssl.duitang.com/uploads/item/201507/04/20150704212949_PSfNZ.jpeg']




    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    updateInfoBox =()=>{

    }


    componentDidMount() {
        this.props.child(this);
    }

    render() {
        const empty = (
            <Empty description={'无媒体文件'}/>
        );
        const listItem =item=> (
            <Row type="flex" align="middle" justify="center">
                <Col>
                    <Card
                        hoverable
                        style={{ width: 250}}
                        cover={<img alt="example" src={item} />}>
                        <Card.Meta description="www.instagram.com" />
                    </Card>
                </Col>
            </Row>
        )
        const mList= (
            <div className={'info-box-list-container'}>
                <List
                    itemLayout={"vertical"}
                    dataSource={this.datasource}
                    renderItem={item => <List.Item>{listItem(item)}</List.Item>}>
                </List>
            </div>
        );

        return (
            <div className={'info-box'}>

                {mList}

            </div>
        );
    }


}

export default MediaInfoBoxComponent;


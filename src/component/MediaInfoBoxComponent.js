import React from 'react'
import {Button, Col, Input, message, Avatar,Progress,
    Row, Spin, List, Card, Modal, Upload,Icon} from "antd";
import './MediaInfoBoxComponent.css'
import Axios from "axios";

function toDownloadPath(url){return '/api/epoint/files/'+url;}


class MediaInfoBoxComponent extends React.Component{

    datasource=["http://file02.16sucai.com/d/file/2014/0704/e53c868ee9e8e7b28c424b56afe2066d.jpg",
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1576233053226&di=61785702c6ce6f203b06d0d0801887fe&imgtype=0&src=http%3A%2F%2Fgss0.baidu.com%2F9vo3dSag_xI4khGko9WTAnF6hhy%2Fzhidao%2Fpic%2Fitem%2F5366d0160924ab189ee8059f30fae6cd7a890b9f.jpg',
        "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png",
        '/api/epoint/files/1.jpg',
        '/api/epoint/files/2_20_13ded2a4e_katou-megumi-sakura-3840x2160.png'
    ]


    // 文件项定义
    // fileItem = {
    //         fid:0,
    //         fName:'',
    //         rowUrl:'',// 原始文件路径
    //         previewUrl:'',//预览图文件地址
    //         fType:0,//文件类型
    //         describe:'',//文件描述
    //         epMiId:0,//媒体文件id
    //         percent:null | 0-100 // 是否加载
    //         isUploadError:false | true
    //      }

    ds=[
        {
            fid:0,
            rowUrl:this.datasource[0],// 原始文件路径
            previewUrl:this.datasource[0],//预览图文件地址
            fType:0,//文件类型
            describe:'花',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },
        {
            fid:1,
            rowUrl:this.datasource[1],// 原始文件路径
            previewUrl:this.datasource[1],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },
        {
            fid:2,
            rowUrl:this.datasource[2],// 原始文件路径
            previewUrl:this.datasource[2],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },

        {
            fid:3,
            rowUrl:this.datasource[3],// 原始文件路径
            previewUrl:this.datasource[3],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        },
        {
            fid:4,
            rowUrl:this.datasource[4],// 原始文件路径
            previewUrl:this.datasource[4],//预览图文件地址
            fType:0,//文件类型
            describe:'女孩',//文件描述
            epMiId:0,//媒体文件id
            percent:null // 是否加载
        }

    ]


    state={
        // 显示管理文件对话框
        showFileOps:false,
        infoBoxSpinning:false,
        // 操作

        infoBoxDatasource:[],
        opDataSource:[],
    }


    // 父组件关闭时
    closeInfoBox =()=>{
        console.debug('infobox closed')
    }

    updateInfoBox =()=>{
        const {data} = this.props;
        if(data.epMiInfo==null)
            this.getMediaInfoFromService(data);
        else{
            //  重要！！！！！
            //  infoBoxDatasource和opDataSource 不共用，
            let ls = this.formatMediaInfo(data.epMiInfo);
            this.setState({
                infoBoxDatasource:ls,
                opDataSource:[...ls] // 深复制
            });
        }
    }

    getMediaInfoFromService=(epoint)=>{
        this.setState({infoBoxSpinning:true});
        Axios({
            url:'/api/epoint/get_mediainfo',
            method:'get',
            params:{
                "epId":epoint.epId,
            },
        }).then(respone=>{
            this.setState({infoBoxSpinning:false});
            console.debug('getMediaInfoFromService',respone);
            // 成功回调
            const res = respone.data;
            if(res.code === 1000){
                let ls = this.formatMediaInfo(res.data);
                this.setState({
                    infoBoxDatasource:ls,
                    opDataSource:ls});
                epoint.epMiInfo = res.data;
            }else{
                message.error("获取媒体文件失败！");
            }
        }).catch(e=>{
            this.setState({infoBoxSpinning:false});
            if(Axios.isCancel(e)){
                console.log("获取媒体信息取消");
            }else{
                message.error("未知错误！");
                console.log(e);
            }
        })
    }

    formatMediaInfo(infoList){
        let ret=[];
        infoList.forEach((item,_,__)=>{
            ret.unshift({
                fid:item.epMiId,
                fName:item.epMiPath,
                rowUrl:item.epMiPath,// 原始文件路径
                previewUrl:item.epMiPath,//预览图文件地址
                fType:item.epMiType,//文件类型
                describe:item.epMiDesc,//文件描述
                epMiId:item.epMiId,//媒体文件id
                percent:null  // 是否加载
            });
        })
        return ret;
    }

    // 父组件调用，显示文件管理对话框
    showFilesModal=()=>{
            if(!this.state.showFileOps)
                this.setState({showFileOps:true})
    }


    componentDidMount() {
        this.props.child(this);
    }

    // 当上传成功时调用
    onUploadSuccess = fileType=>{
        const {data} = this.props
        const mi={
            "epMiId": fileType.epMiId,
            "epMiType": fileType.fType,
            "epId": data.epId,
            "epMiDesc": fileType.describe,
            "epMiPath": fileType.rowUrl,
            "uid": data.uid
        }
        this.props.data.epMiInfo.push(mi);
    }


    // 上传组件状态变更回调
    onUploadChange=({file,_,__})=>{
        console.debug(file);
        const {opDataSource} = this.state;
        const response = file.response;
        // 查找是否之前创建过上传中的图
        let t = opDataSource.find(item=>item.fid===file.uid);
        if(t==null){
            // 还未创建
            let newt = {
                fid:file.uid,
                fName:file.name,
                rowUrl:'',// 原始文件路径
                previewUrl:'',//预览图文件地址
                fType:0,//文件类型
                describe:'',//文件描述
                epMiId:-1,//媒体文件id
                percent:0, // 是否加载
                isUploadError:false
            }
            if(response!=null&&response.code!==1000){
                newt.isUploadError=true;
            }
            opDataSource.unshift(newt);
        }else if(!t.isUploadError){

            if(response!=null&&response.code!==1000){
                t.isUploadError=true;
            }else if(file.status==='error'){
                t.isUploadError=true;
            }else if(file.status==='uploading'){
                t.percent=file.percent.toFixed(0);
            }else if(file.status==='done'){
                if(response==null)
                    t.isUploadError=true;
                else{
                    //传输正确完成
                    const info = file.response.data;
                    t.fid = info.epMiId;
                    t.fName=info.epMiPath;
                    t.epMiId = info.epMiId;
                    t.percent=null;
                    t.rowUrl=info.epMiPath;
                    t.previewUrl=info.epMiPath;
                    t.fType = info.epMiType;
                    this.onUploadSuccess(t);
                }
            }
        }
        this.setState({opDataSource:opDataSource})
    }


    // 点击下载
    onModalItemDownloading=fileItem=>{
        console.debug('onModalItemDownloading',fileItem)
    }

    // 点击删除
    onModalItemDeleting=fileItem=>{
        console.debug('onModalItemDeleting',fileItem)
    }

    // 点击预览
    onModalItemPreviewing=fileItem=>{
        console.debug('onModalItemPreviewing',fileItem)
    }



    beforeUpload=(file,fileList)=>{
        console.debug('beforeUpload',file,fileList)
        return true;
    }


    listInfoBoxItem =item=> (
        <List.Item>
                <Row type="flex" align="middle" justify="center">
                    <Col>
                        <Card
                            hoverable
                            style={{ width: 250,minHeight:100}}
                            cover={<img alt={item.fName} src={toDownloadPath(item.previewUrl)} />}>
                            <Card.Meta description={""} />
                        </Card>
                    </Col>
                </Row>
        </List.Item>
    )

    modalListItem =item=>(
        <List.Item>
            <PictureContainer
                onPreviewing={this.onModalItemPreviewing}
                onDeleting={this.onModalItemDeleting}
                onDownloading={this.onModalItemDownloading}
                data={item}/>
        </List.Item>
    );

    render() {
        const {infoBoxDatasource,opDataSource,infoBoxSpinning} = this.state;
        const {data} = this.props;
        const uploadBtn=(
            <Upload
                multiple={true}
                // action={"/api/epoint/upload_mediainfo"}
                action={"/api/epoint/upload_mediainfo?epId="+data.epId}
                headers={{'c-version':'1.0'}}
                showUploadList={false}
                onChange={this.onUploadChange}
                beforeUpload={this.beforeUpload}
                >
                <Button type={"primary"}>
                    <Icon type="upload" /> 点击上传文件
                </Button>
            </Upload>
        );

        return (
            <div>
                <Modal
                   title={uploadBtn}
                   footer={null}
                   closable={true}
                   visible={this.state.showFileOps}
                   destroyOnClose={true}
                   mask={false}
                   width={1000}
                   onCancel={e=>{this.setState({showFileOps:false})}}
                   style={{}}>
                    <div className={'modal-body-container'}>
                        <List
                            bordered={false}
                            grid={{gutter:[0,0], column: 3,}}
                            // itemLayout="horizontal"
                            dataSource={opDataSource}
                            renderItem={this.modalListItem}
                            style={{height:'100%'}}
                        />
                    </div>
                </Modal>
                <div className={'info-box'}>
                    <div className={'info-box-list-container'}>
                        <Spin tip={"加载文件列表中..."}
                              delay={500}
                              spinning={infoBoxSpinning}>
                            <List
                                bordered={false}
                                itemLayout={"vertical"}
                                dataSource={infoBoxDatasource}
                                renderItem={this.listInfoBoxItem}>
                            </List>
                        </Spin>
                    </div>
                </div>
            </div>

        );
    }


}



class PictureContainer extends React.Component{

    state={
        showMask:'none',
        isError:false,
    }

    render() {
        const {data,onPreviewing,onDownloading,onDeleting} = this.props;
        const {showMask} = this.state;
        const percent =data==null?null:data.percent;
        return (
            <div className={'file-item-container'}
                 onMouseEnter={event => {
                     if(percent==null)
                         this.setState({showMask:'block'})
                 }}
                 onMouseLeave={event => {
                     if(percent==null)
                         this.setState({showMask:'none'})
                 }}>
                <div className={'file-item-pic-mask'} style={{display:showMask}}>
                    <Row type={'flex'}
                         justify="center"
                         align="middle"
                        gutter={[20,0]}>
                        <Col>
                                <Icon type={'eye'} className={'icon-in-pc'}
                                      onClick={e=>onPreviewing(data)}/>
                        </Col>
                        <Col>
                            <Icon type={'cloud-download'} className={'icon-in-pc'}
                                  onClick={e=>onDownloading(data)}/>
                        </Col>
                        <Col>
                            <Icon type={'delete'} className={'icon-in-pc'}
                                  style={{color:'red'}}
                                  onClick={e=>onDeleting(data)}
                            />
                        </Col>
                    </Row>
                </div>
                <div className={'file-item-pic-mask'}
                     style={{display:percent==null?'none':'block'}}>
                    <Row type={'flex'}
                         justify="center"
                         align="middle"
                         gutter={[20,0]}>
                        <Col>
                            <div style={{top:'15px',position:'relative'}}>
                                <Progress type="circle" width={80} style={{top:'10px'}}
                                          percent={percent==null?0:Number(percent)}
                                />
                            </div>
                        </Col>
                    </Row>

                </div>
                <div id={'file-mask'} className={'file-item-pic-container'}>
                    <img style={{height:'100%',width:'100%',objectFit:'contain'}}
                         src={toDownloadPath(data.previewUrl)}
                         alt={data.fName}
                    />
                </div>
            </div>
        );
    }


}


export default MediaInfoBoxComponent;


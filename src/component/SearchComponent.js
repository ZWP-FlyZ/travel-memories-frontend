import React from "react"
import Axios from 'axios'
import {Input, Select, AutoComplete, Button} from 'antd'
import './SearchComponent.css'
import debounce from 'lodash/debounce';


class SearchComponent extends React.Component{


    constructor(props, context) {
        super(props, context);

        // 防抖处理
        this.onSearch = debounce(this.onSearch,400)
    }

    state={
        // 搜索类型，0-地图，1-事件点
        searchType:0,
        //搜索文本
        searchText:'',
        resultData:[],
    }
    curSearchList = [];
    curSelect=null;

    strMatch(origin, target){
        return origin.indexOf(target)>=0;
    }

    onSearch = target=>{
        const {searchType} = this.state;

        // 去除首尾空格
        target = target.replace(/^\s+|\s+$/g,"");
        console.debug('onSearch',target)
        if(target ===''){
            this.curSearchList=[];
            this.setState({resultData:[]});
            this.curSelect=null;
            return ;
        }else if(searchType===0){
            // 搜索地图
            Axios({
                url:'/baiduapi/place/v2/suggestion',
                method:'get',
                params:{
                    'ak':'Pb5xNpGhi4zlcj7g9HgVfTMISfEsmx5m',
                    'query':target,
                    'region':'全国',
                    'output':'json',
                }
            }).then(response=>{
                console.debug(response);
                // 成功回调
                const res = response.data.result;
                let datasource = [];
                if(res.length>0){
                    this.curSearchList = res;
                    res.forEach((item,idx,_)=>{

                        datasource.push({text:item.name+'-'+item.province,
                                        value:idx})
                    })
                }
                this.setState({resultData:datasource})
            });
        }else{
            // 搜索事件点
            // 用户未登录
            const {epoints} = this.props;
            if(epoints==null)  return ;
            let point =null;
            this.curSearchList = [];
            let datasource=[];
            for(let idx=0;idx<epoints.drawPoints.length;idx++){
                point = epoints.drawPoints[idx];
                if(this.strMatch(point.epTitle,target)||
                    this.strMatch(point.epAddr,target)){
                    datasource.push({text:point.epTitle,
                        value:this.curSearchList.length})
                    this.curSearchList.push(point);
                }
            }

            for(let idx=0;idx<epoints.remPoints.length;idx++){
                point = epoints.remPoints[idx];
                if(this.strMatch(point.epTitle,target)||
                    this.strMatch(point.epAddr,target)){
                    datasource.push({text:point.epTitle,
                        value:this.curSearchList.length})
                    this.curSearchList.push(point);
                }
            }
            this.setState({resultData:datasource})
        }
    }

    onDropDownSelect=e=>{
        this.curSelect = this.curSearchList[e];
        let tmp = this.state.resultData[e].text;

        this.setState({searchText:tmp.split('-')[0]})
    }

    onClickGo=e=>{
        console.debug(this.curSelect);
        if(this.curSelect!=null){
            if(this.state.searchType==0)
                this.props.onSearchMapSuccess(this.curSelect);
            else
                this.props.onSearchEpointSuccess(this.curSelect);
        }

    }

    onSelect=e=>{
        this.setState({searchType:e,searchText:'',
            resultData:[],btnDisable:true},()=>{
            this.curSearchList = [];
            this.curSelect=null;
        })
    }

    render() {
        const { Option } = Select;
        return (
            <div style={{width:'100%',height:'100%'}}>
                <Input.Group style={{width:'100%',height:'100%'}} compact>
                    <Select defaultValue={0}
                            style={{width:'20%'}}
                            size={"large"}
                            onChange={this.onSelect}
                            disabled={this.props.epoints==null}>
                        <Option value={0}>地图</Option>
                        <Option value={1}>事件点</Option>
                    </Select>
                    <AutoComplete size={"large"}
                                  style={{width:'65%'}}
                                  backfill={true}
                                  dataSource={this.state.resultData}
                                  onSearch={this.onSearch}
                                  onSelect={this.onDropDownSelect}
                                  onChange={e=>{this.setState({searchText:e})}}
                                  allowClear={true}
                                  dropdownMenuStyle={{maxHeight:400}}
                                  value={this.state.searchText}>
                        <Input placeholder="搜索内容"
                               maxLength={15}
                               onPressEnter={this.onClickGo}
                        />
                    </AutoComplete>
                    <Button
                            onClick={this.onClickGo}
                            type={"primary"}
                            size={"large"}
                            style={{width:'15%'}}>Go</Button>
                </Input.Group>
            </div>
        );

    }

}

export default SearchComponent;


var isPictureUpload=false;
// $('#editable-select').editableSelect();
// //初始化可输入select属性
// $('#editable-select').editableSelect({ effects: 'slide' });
//专题图保存模态框出现前触发
$('#map-upload-Modal').on('show.bs.modal', function () {

    // 根据map_id判断当前地图是否存在
    window.localStorage.setItem("mapId", "9");
    var map_id = window.localStorage.getItem("mapId");
    //后台交互判断是否存在当前地图
    $.ajax({
        type: 'post',
        url: "./servlet/EditMapServlet",
        dataType: "json",
        async: false,
        data: {
            "type": "mapInfoUpload",
            "map_id": map_id
        },
        success: function (data) { //返回json结果
            var mapTagsStr=window.localStorage.getItem("map_tag");
            mapTagJson=JSON.parse(mapTagsStr);
            $("#editable-select").html("");
            for(var i in mapTagJson) {
                if(i>0) $("#editable-select").append('<option value='+mapTagJson[i]+' >' + mapTagJson[i] + '</option>');
            }
            $('#editable-select').editableSelect({ effects: 'slide' });
            $("#editable-select").find("option:contains('"+data.map_tag+"')").attr("selected",true);
            $("#mapTitle_Upload").val(data.map_name);
            $("#editable-select").val(data.map_tag);
            $("#mapInfo_Upload").val(data.map_info);
            $('#demo1')[0].src = data.picture;




        }
    });
});

$("#uploadBt").click(function (e) {
    //上传参数，包括用户ID、专题图名称、分类标签、信息描述、假删除状态（1-删除，0-未删除，默认为0）、图层参数、缩略图

    var mapTitle = document.getElementById("mapTitle_Upload").value;
    var mapTag=$("#editable-select").val();
   // if (mapTag=="") mapTag=$("#mapTag_Init").val();
    var mapInfo=$("#mapInfo_Upload").val();
    var treeNodes=$.fn.zTree.getZTreeObj("doMapTree").getNodes();
    var treeNodes=JSON.stringify(treeNodes);
    var userId="testUser1";
    var picture64=$('#demo1')[0].src;

    var servletUrl="./servlet/EditMapServlet";
    //缩略图上传

    $.ajax({
        type: 'post',
        url:servletUrl,
        dataType:"json",
        async:false,
        data:{ "type":"mapInfoUpload","map_id":"","mapTitle":mapTitle,"mapTag":mapTag,"mapInfo":mapInfo,"treeNodes":treeNodes,"picture64":picture64,"userId":userId},
        success: function (data) { //返回json结果
            alert("已保存")

        }

    });
});
 layui.use('upload', function(){
     var $ = layui.jquery
         ,upload = layui.upload;

     //普通图片上传
     var uploadInst = upload.render({
         elem: '#test1'
         ,url: './servlet/fileUploadServlet'
        ,data:{type:"mapInfoUpload"}
         ,size: 2*1024
         ,before: function(obj){
             //预读本地文件示例，不支持ie8
             obj.preview(function(index, file, result){
                 $('#demo1').attr('src', result); //图片链接（base64）
                 isPictureUpload=true;
             });
         }
         ,done: function(res){
             //如果上传失败
             if(!isPictureUpload){
                 return layer.msg('上传失败');
             }
             //上传成功
         }
         // ,error: function(){
         //     //演示失败状态，并实现重传
         //     var demoText = $('#demoText');
         //     demoText.html('<span style="color: #FF5722;">上传失败</span> <a class="layui-btn layui-btn-xs demo-reload">重试</a>');
         //     demoText.find('.demo-reload').on('click', function(){
         //         uploadInst.upload();
         //     });
         // }
     });
 });

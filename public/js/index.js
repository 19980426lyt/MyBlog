$(function() {
    var registerBox=$("#register");
    var loginBox=$("#login");
    var userInfo=$("#userInfo");

    loginBox.find('a').bind('click',function(){
        registerBox.show();
        loginBox.hide();
    });

    registerBox.find('a').bind('click',function(){
        loginBox.show();
        registerBox.hide();
    });

    registerBox.find('button').bind('click',function(){
        $.ajax({
            type: 'post',
            url:'/api/user/regixter',
            data: {
                username: registerBox.find('[name="username"]').val(),
                password: registerBox.find('[name="password"]').val(),
                repassword: registerBox.find('[name="repassword"]').val(),
            },
            dataType:'json',
            success:function(result){
                if(!result.code){
                    alert(result.message);
                    loginBox.show();
                    registerBox.hide();
                }else{
                    alert(result.message);
                }
            }
        });
    });

    loginBox.find('button').bind('click',function(){
        $.ajax({
            type: 'post',
            url:'/api/user/login',
            data: {
                username: loginBox.find('[name="username"]').val(),
                password: loginBox.find('[name="password"]').val()
            },
            dataType:'json',
            success:function(result){
                if(!result.code){
                    alert(result.message);
                    window.location.reload();
                }else{
                    alert(result.message);
                }
            }
        });
    });

    $('#loginOut').bind('click',function(){
        $.ajax({
            type: 'get',
            url:'/api/user/loginout',
            success:function(result){
                if(!result.code){
                    window.location.reload();
                }
            }
        });
    });

});
let url ="";
let msg ="";
$(document).ready(function () {
    $("#detailContains").css("display", "none");
    // when click the create button, show the detailContains
    $("#selCreate").on('click', function () {
        // clear all input
        $(':input', '#frmDetail')
            .not(':button, :submit, :reset, :hidden')
            .val(''); 
        // show the detailContains
        $("#detailContains").css("display", "block");
        // hide the queryContainer
        $("#queryContainer").css("display", "none");
        url = "/country/creat";
        msg = "新規";
    });

    // when click the update button, show the queryContainer
    $("#selUpdate, #selDelete").on('click', function () {
        // show the queryContainer
        $("#queryContainer").css("display", "block");
        // hide the detailContains
        $("#detailContains").css("display", "none");
        // set the form action for update
        $("#frmDetail").attr("action", "/UpdateCountry");
        if($(this).attr("id")=="selUpdate"){
			url = "/country/update";
			msg = "更新";
		}else{
			url = "/country/delete";
			msg = "削除";
		}
        
    });

    // when click the return button, hide the detailContains
    $("#returnBtn").on('click', function () {
        // show the queryContainer
        // $("#queryContainer").css("display", "block");
        // hide the detailContains
        $("#detailContains").css("display", "none");
    });

    $("#queryBtn").on('click', function () {
        // use ajax to post data to controller
        // recived the data from controller with json
        // show the data in the detailContains
        $.ajax({
            type: "POST",
            url: "/country/getCountry",        //  <- controller function name
            data: $("#frmSearch").serialize(),
            dataType: 'json',
            success: function (data) {
                $("#detailContains").css("display", "block");
                // show the data in the detailContains
                $("#countryCode").val(data.countryCode);
                $("#name").val(data.name);
            },
            error: function (e) {
                alert("error");
            }
        });
    });
     $("#updateBtn").on('click', function () {

		   $.ajax({
	         type: "POST",
	         url: url,        //  <- controller function name
	         data: $("#frmDetail").serialize(),
	         dataType: 'json',
	         success: function (data) {
				if(data.status == 0){
					alert(data.message);;
					return;
				}else {
					alert(msg+"を失敗しました");
					return;
				}
	           },
	            error: function (e) {
	                alert(msg+"を失敗しました");
	          },
	       });
	  	});  
});
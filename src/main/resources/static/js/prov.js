let table;
let selected;
let currentRow;
let selectedRow;
let tableData;
let url ="";
let msg ="";

$(document).ready(function () {
  bindTable();

  $("#searchBtn").on("click", function () {
    // show table
    getTableDatas();
  });

  // event handler for submit button
  $("#btnExec").on("click", function () {
	  var selectedValue = $('input[name="gridRadios"]:checked').val();
	 if (selectedValue == undefined) {
		alert("操作を選んでください。");
		return;
	}else{
		
	    selected = table.rows({ selected: true }).data().toArray();
	    currentRow = 0;
	    selectedRow = selected.length;
	    $("#currSpan").text(currentRow + 1);
	    $("#totalSpan").text(selectedRow);
	    getRecord();
	}
  });

  // event handler for previous button
  $("#oprateBtn").on("click", function () {
	 var selectedValue = $('input[name="gridRadios"]:checked').val();
	  if (selectedValue == "del") {
		  url = "/prov/delete";
		  msg = "削除";
	  } else if (selectedValue == "edit") {
		  msg = "修正";
		  url = "/prov/update";
	  } else if (selectedValue == "add") {
		  msg = "新規";
		  url = "/prov/create";
	  } else {
		  alert("修正又は削除の操作を選んでください。");
		  return;
	  }
	  $.ajax({
		  type: "POST",
		  url: url,        //  <- controller function name
		  data: $("#frmDetail").serialize(),
		  dataType: 'json',
		  success: function(data) {
			  if (data.status == 0) {
				  // 选中行的数据, 处理成功后, 修改状态
				  var rowData = table.rows({ selected: true }).ids();
				  var row = table.row("#" + rowData[currentRow]);
				  if (selectedValue == "del") {
					  table.row("#" + rowData[0]).remove().draw();
				  } else if (selectedValue == "edit") {
				      var rowBinding = row.data();
					  rowBinding.sts = "已处理";
					  rowBinding.mstcountrycd = $("#countryCd").val();
					  rowBinding.provcode = $("#provCd").val();
					  rowBinding.provname = $("#provName").val();
					  row.data(rowBinding).draw();
				  } else {
					  $("#countryCd").val("");
					  $("#provCd").val("");
					  $("#provName").val("");
				  }

				  // 设置该行不可选
				  //row.nodes().to$().addClass("disabled");

				  currentRow++;
				  if (currentRow == selectedRow) {
					  // close modal
					  $("#closeModalBtn").click();
					  return;
				  }
				  $("#currSpan").text(currentRow + 1);
				  getRecord();
				  alert(data.message);;
				  return;
			  } else {
				  alert(msg + "を失敗しました");
				  return;
			  }
		  },
		  error: function(e) {
			  alert(msg + "を失敗しました");
		  },
	  });
      
  });
});

// get record
function getRecord() {
  // ajax call to get record
  var row = selected[currentRow];
  $.ajax({
    type: "GET",
    url: "/prov/getRecord/" + row.mstcountrycd + "/" + row.provcode,
    datatype: "json",
    success: function (data) {
      var item = $.parseJSON(data);
      $("#countryCd").val(item.mstcountrycd);
      $("#provCd").val(item.provcode);
      $("#provName").val(item.provname);
    },
    error: function (e) {
      alert("Error: " + e);
    },
  });
  return;
}

// set table data
function bindTable() {
  // set up table
  let option = {
    columnDefs: [
      {
        targets: ["_all"],
        className: "mdc-data-table__cell",
      },
      {
        orderable: false,
        className: "select-checkbox",
        targets: 0,
      },
    ],
    rowId: "provcode",
    columns: [
      {
        data: null,
        defaultContent: "",
        orderable: false,
        className: "select-checkbox",
      },
      { data: "sts", defaultContent: "未处理", orderable: false },
      { data: "mstcountrycd" },
      { data: "provcode" },
      { data: "provname", className: "text-right" },
    ],
    data: tableData,
    order: [4, "asc"],
    select: {
      style: "multi",
    },
  };

  table = $("#prefecture_table").DataTable(option);
}

// get table data with country id
function getTableDatas() {
  // show table
  $.ajax({
    type: "GET",
    url: "/prov/search/" + $("#countryInput").val(),
    datatype: "json",
    success: function (data) {
      // 文字对象 转换 javaScript对象
      var nodes = $.parseJSON(data);

      table.clear();
      table.rows.add(nodes).draw();
    },
    error: function (e) {
      alert("Error: " + e);
    },
  });
}

var api_host='http://localhost:3000';



function ajax_post(url,success,data){
	$.ajax({
			type:'post',
			url:api_host+url,
			async:true,
			contentType:'application/json; charset=utf-8',
			data:JSON.stringify(data),
			dataType: "json",
			success:success
	});
}



function get_url_query_variable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return false;
}
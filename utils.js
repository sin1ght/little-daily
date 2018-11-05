const Utils={
    getTime(){
        var date=new Date();
        var time=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes();
        return time;
    },

    getTimeWithWeek(){
        var weekday=["周日","周一","周二","周三","周四","周五","周六"];
        var date=new Date();

        return this.getTime()+" "+weekday[date.getDay()];
    }
}




module.exports=Utils;
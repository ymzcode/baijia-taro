function output(o,t,u){var n=[];n.push("%c"+o[0],"color:"+t+";background-color:"+u+";padding: 2px 4px;"),console.log.apply(console,n)}exports.primary=function(){output(arguments,"#004085","#cce5ff")},exports.secondary=function(){output(arguments,"#464a4e","#e7e8ea")},exports.success=function(){output(arguments,"#155724","#d4edda")},exports.danger=function(){output(arguments,"#721c24","#f8d7da")},exports.warn=function(){output(arguments,"#856404","#fff3cd")},exports.info=function(){output(arguments,"#0c5460","#d1ecf1")},exports.light=function(){output(arguments,"#818182","#fefefe")},exports.dark=function(){output(arguments,"#1b1e21","#d6d8d9")};
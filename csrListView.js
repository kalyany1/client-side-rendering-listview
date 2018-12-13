var LIST_CAPITAL_CALL_REQUEST = 'List1'; var LIST_EXTERNAL_MANAGER_FEES = 'List2'; var LIST_APPROVERS = 'Approvers';
var aryRowCCIds = [];var aryRowEMFIds = [];

(function() {
    document.write('<script src="/sites/team/CapitalCalls/SiteAssets/CapitalCalls/jquery.js" type="text/javascript"></script>');    	

    var formContext = {};  
    formContext.Templates = {};
    formContext.OnPostRender = getDataOnPostRender;  
    SPClientTemplates.TemplateManager.RegisterTemplateOverrides(formContext);  
})();

function getDataOnPostRender(ctx) {	    
    ExecuteOrDelayUntilScriptLoaded(getFilteredCCData(ctx), "sp.js");
    ExecuteOrDelayUntilScriptLoaded(getFilteredEMFData(ctx), "sp.js");
}

function getFilteredCCData(ctx) {

    var urlForCC = "/_api/Web/Lists/GetByTitle('"+ LIST_CAPITAL_CALL_REQUEST +"')/Items?$filter=(CCIsPaid eq '0' and (CCPayDate eq null) and (CCPayApprover eq null) " +
                   "and (CCWFStatus ne 'Closed') and (CCWFStatus ne 'Canceled') and (CCFirstApproverTimeStamp ne null) and (CCSecondApproverTimeStamp ne null) " + 
                   "and (CCFirstApproverTimeStamp ne '1900-01-01T05:00:00Z') and (CCSecondApproverTimeStamp ne '1900-01-01T05:00:00Z'))&$select=Id";	   

	try{
		getItemsByRest(urlForCC).done(function(data){
			if(data.d.results.length > 0){
				var allResult = data.d.results;               
                
                for(i = 0; i<data.d.results.length; i++){
                    if(aryRowCCIds.indexOf(allResult[i].Id) > -1){                        
                    }else{                        
                        aryRowCCIds.push(allResult[i].Id);
                    }                    
                }
			}
            
            var rows = ctx.ListData.Row;
            /*console.log(ctx.ListData);console.log(rows);
            console.log(aryRowCCIds.length);console.log(ctx.ListData);console.log(rows.length);*/

            for (var i = 0; i < rows.length; i++) {
                
                var rowId = GenerateIIDForListItem(ctx, rows[i]);
                var row = document.getElementById(rowId);                                  
                /*console.log('"' + rows[i].ID + '"');console.log(aryRowCCIds.indexOf(rows[i].ID));*/
                $.each(aryRowCCIds, function(iCount, v) { /*console.log('V: ' + v + '; ID: ' + rows[i].ID);*/
                    try{                        
                        if(v.toString() === rows[i].ID.toString() && !isBlank(rows[i].CCPartnership)){
                            row.style.backgroundColor = 'lightblue';
                        }
                    }catch(ex1){
                        Console.log('CC CCTotal does not exist');
                    }                    
                });
            }

		});

	}catch(ex){		
		saveErrorLogData('CC','CCR ListView, ' + ex.message);		
	}
}

function getFilteredEMFData(ctx) {

    var urlForEMF = "/_api/Web/Lists/GetByTitle('"+ LIST_EXTERNAL_MANAGER_FEES +"')/Items?$filter=(CCIsPaid eq '0' and (CCPayDate eq null) and (CCPayApprover eq null) " +
                   "and (CCWFStatus ne 'Closed') and (CCWFStatus ne 'Canceled') and (CCFirstApproverTimeStamp ne null) and (CCSecondApproverTimeStamp ne null) " + 
                   "and (CCFirstApproverTimeStamp ne '1900-01-01T05:00:00Z') and (CCSecondApproverTimeStamp ne '1900-01-01T05:00:00Z'))&$select=Id";
	try{
		getItemsByRest(urlForEMF).done(function(data){
			if(data.d.results.length > 0){
				var allResult = data.d.results;               
                
                for(i = 0; i<data.d.results.length; i++){
                    if(aryRowEMFIds.indexOf(allResult[i].Id) > -1){                        
                    }else{                        
                        aryRowEMFIds.push(allResult[i].Id);
                    }                    
                }                
			}            
            
            var rows = ctx.ListData.Row;            
            for (var i = 0; i < rows.length; i++) {
                
                var rowId = GenerateIIDForListItem(ctx, rows[i]);
                var row = document.getElementById(rowId);                  
                
                /*console.log('"' + rows[i].ID + '"');console.log(aryRowEMFIds.indexOf(rows[i].ID));*/
                $.each(aryRowEMFIds, function(iCount, v) { /*console.log('V: ' + v + '; ID: ' + rows[i].ID);*/
                    try{                        
                        if(v.toString() === rows[i].ID.toString() && !isBlank(rows[i].CCTotal)){
                            row.style.backgroundColor = 'lightblue';
                        }
                    }catch(ex1){
                        Console.log('EMF CCTotal does not exist');
                    }
                });                
            }
                     
		});
	}catch(ex){		
		saveErrorLogData('CC','EMF ListView, ' + ex.message);		
	}
}

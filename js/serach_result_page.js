/*

*/

$(document).ready(function() {
       $('.jshead').live("click", function() {
            var ele = $(this).find('span:first');
            ele.toggleClass('ui-icon-circle-arrow-s ui-icon-circle-arrow-e');
            $(this).next().toggle('slow');
            return false;
       });
       // $.getScript('/ccmodule/js/jquery.bt.min.js', function() {
       $.getScript('/js/jquery/plugins-src/jquery.bt.v097.min.js', function() {
             $('.warninfo [title]').bt({positions:['most'], width:550, centerPointX:.8,
                                        spikeLength:10, spikeGirth:15, padding:'15px',
                                        fill:'#FFF', strokeStyle:'#ABABAB',
                                        strokeWidth:1, cssStyles:{fontSize:'150%'}});
       });
       $('#get_new_prdid').click(function() {
           var prd_id = 'None';
           $.ajax({ type: 'POST', async: false, url: '/cgi-bin/processing/getNewPrdID.py',
               dataType: 'json', success: function(jsonOBJ) {
                   prd_id = jsonOBJ.prd_id;
               }
           });
           if (prd_id != 'None') {
               $('#prd_id').val(prd_id);
               $('#prd_id').show();
           }
       });
       $('#get_new_famid').click(function() {
           var fam_id = 'None';
           $.ajax({ type: 'POST', async: false, url: '/cgi-bin/processing/getNewFamID.py',
               dataType: 'json', success: function(jsonOBJ) {
                   fam_id = jsonOBJ.fam_id;
               }
           });
           if (fam_id != 'None') {
               $('#fam_id').val(fam_id);
               $('#famid_display').html(fam_id);
               $('#famid_display').show();
           }
       });
       $('#get_exist_famid').click(function() {
           var prd_id = $('#exist_prd_id').val();
           if (prd_id == '') {
               alert('Existing PRD ID is not provided');
           } else {
               $.ajax({ type: 'POST', async: false, url: '/cgi-bin/processing/getExistFamID.py',
                   data: 'exist_prd_id='+prd_id, dataType: 'json', success: function(jsonOBJ) {
                       if (jsonOBJ.errorflag) {
                           alert(jsonOBJ.errortext);
                       } else {
                           $('#fam_id').val(jsonOBJ.fam_id);
                           $('#famid_display').html(jsonOBJ.fam_id);
                           $('#famid_display').show();
                       }
                   }
               });
           }
       });
});

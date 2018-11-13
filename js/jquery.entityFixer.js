
jQuery.entityFixer={

Fixer:function (op) {
     var apply_to_all_option = 'false';
     if ($('#applyToAll').is(':checked')) {
         // apply_to_all_option = '&alloption=true';
         apply_to_all_option = 'true';
     }
     var mol=$('#chemWin1').chemWinMol();
     var cif=mol.toCif('any');
     // alert(jQuery.entityFixer.sessionId);
     // alert(jQuery.entityFixer.instId);
     // alert(cif);
/*
     cif = cif.replace('+', '%2B', 'g');
     cif = cif.replace(';', '%3B', 'g');
     cif = cif.replace('$', '%24', 'g');
     cif = cif.replace('&', '%26', 'g');
     cif = cif.replace(',', '%2C', 'g');
     cif = cif.replace('/', '%2F', 'g');
     cif = cif.replace(':', '%3A', 'g');
     cif = cif.replace('=', '%3D', 'g');
     cif = cif.replace('?', '%3F', 'g');
     cif = cif.replace('@', '%40', 'g');
*/
     jQuery.chemWin.setInProgress(true,"chop");
     var message = 'failed';

     $.ajax({ type: 'POST',
         async: false,
         url: '/service/entity/chopper_output',
         // data: 'cif='+cif+'&sessionid='+jQuery.entityFixer.sessionId+'&identifier='+jQuery.entityFixer.identifier+'&instanceid='+jQuery.entityFixer.instId+'&option='+op+apply_to_all_option,
         dataType: 'json',
         data: { 'cif': cif, 'sessionid': jQuery.entityFixer.sessionId , 'identifier': jQuery.entityFixer.identifier, 'instanceid': jQuery.entityFixer.instId, 'option': op, 'alloption': apply_to_all_option },
         success: function(jsonOBJ) {
             message = jsonOBJ.statuscode;
         }
     });
     jQuery.chemWin.setInProgress(false,"chop");
     alert(message);
}

};

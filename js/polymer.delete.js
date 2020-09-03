var hidden_count = 0;
var hidden_record_map = {};
var insert_edit_button_set = {};

function get_row_index(table, idArr, display_warning) {
    var res_num = parseInt(idArr[3]);
    var rows = table.find('tr');
    var irow = rows.length;
    if (rows.length > 3) {
        var last_num = parseInt(rows[rows.length - 1].cells[1].textContent);
        if (res_num == last_num) {
            if (display_warning) alert('Residue ' + idArr[2] + ' ' + idArr[3] + ' already included.'); 
            return -1;
        } else if (res_num < last_num) {
            for (var i = 3; i < rows.length; ++i) {
                var ex_res_num = parseInt(rows[i].cells[1].textContent);
                if (res_num == ex_res_num) {
                    if (display_warning) alert('Residue ' + idArr[2] + ' ' + idArr[3] + ' already included.'); 
                    return -1;
                } else if (res_num < ex_res_num) {
                    irow = i;
                    break;
                }
            }
        }
    }
    return irow;
}

function insert_a_row(table, table_id, idattr, idArr, irow) {
    var row = table[0].insertRow(irow);
    for (var i = 0; i < 2; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = idArr[i + 2];
    }

    var form = document.getElementById('edit_form');
    var input = document.createElement('input');
    hidden_count += 1;
    var hidden_id = 'hidden_' + hidden_count;
    input.setAttribute('id', hidden_id);
    input.setAttribute('type', 'hidden');
    var name = 'delete_' + idArr[1];
    input.setAttribute('name', name);
    var value = idArr[2] + '_' + idArr[3];
    input.setAttribute('value', value);
    form.appendChild(input);

    var delete_button_id = 'delete_button_' + hidden_count;
    var delete_button = '<input type="button" class="deleterow action_button" id="' + delete_button_id + '" name="' + table_id + '" value="Delete" />';
    cell = row.insertCell(2); cell.innerHTML = '<div id="inner_' + hidden_count + '">' + delete_button + '</div>';

    if (insert_edit_button_set.hasOwnProperty(table_id)) {
         insert_edit_button_set[table_id].push(hidden_id);
    } else {
         insert_edit_button_set[table_id] = [ hidden_id ];
    }

    var has_greenbg = false;
    if ($('#'+idattr).hasClass("greenbg")) has_greenbg = true;
    hidden_record_map[hidden_id] = [ idattr, has_greenbg, idArr[3] ];

    $('#'+idattr).removeClass("dblclick");
    if (has_greenbg) $('#'+idattr).removeClass("greenbg");
    $('#'+idattr).addClass("bgcoldelete");

    var entity_key = idArr[0] + '_' + idArr[1];
    $('#delete_all_' + entity_key).removeClass("displaynone");
}

function add_row(idattr, idArr, display_warning) {
    var table_id = 'edit_table_' + idArr[0] + '_' + idArr[1];
    var table = $('#'+table_id);

    var irow = get_row_index(table, idArr, display_warning);
    if (irow < 0) return;

    insert_a_row(table, table_id, idattr, idArr, irow);
}

function delete_row(table_id, row_index, hidden_id) {
    var table = document.getElementById(table_id);
    table.deleteRow(row_index);

    var form = document.getElementById('edit_form');
    var input = document.getElementById(hidden_id);
    form.removeChild(input);

    if (hidden_record_map.hasOwnProperty(hidden_id)) {
         var idattr = hidden_record_map[hidden_id][0];
         var has_greenbg = hidden_record_map[hidden_id][1];

         $('#'+idattr).removeClass("bgcoldelete");
         $('#'+idattr).addClass("dblclick");
         if (has_greenbg) $('#'+idattr).addClass("greenbg");

         delete hidden_record_map[hidden_id];
    }

    if (insert_edit_button_set.hasOwnProperty(table_id)) {
         var idx = insert_edit_button_set[table_id].indexOf(hidden_id);
         if (idx > -1) insert_edit_button_set[table_id].splice(idx, 1);
         if (insert_edit_button_set[table_id].length == 0) delete insert_edit_button_set[table_id];
    }

    if (!insert_edit_button_set.hasOwnProperty(table_id)) {
         var delete_all_button = table_id.replace('edit_table_', 'delete_all_');
         $('#' + delete_all_button).addClass("displaynone");
    }
}

function reset_deletion_button(table_id) {
    var rows = $('#'+table_id).find('tr');
    var irow = rows.length;
    if (rows.length < 4) return;

    for (var i = 3; i < rows.length; i++) {
         var curr_inner_id = $(rows[i].cells[2].innerHTML).attr('id');
         var curr_hidden_id = curr_inner_id.replace('inner_', 'hidden_');
         if (!hidden_record_map.hasOwnProperty(curr_hidden_id)) continue;
         
         var delete_button_id = curr_inner_id.replace('inner_', 'delete_button_');
         var delete_button = '<input type="button" class="deleterow action_button" id="' + delete_button_id + '" name="' + table_id + '" value="Delete" />';

         var expend_button = '';
         if ((i+1) < rows.length) {
              var next_inner_id = $(rows[i+1].cells[2].innerHTML).attr('id');
              var next_hidden_id = next_inner_id.replace('inner_', 'hidden_');
              if (hidden_record_map.hasOwnProperty(next_hidden_id)) {
                   var curr_num = parseInt(hidden_record_map[curr_hidden_id][2]);
                   var next_num = parseInt(hidden_record_map[next_hidden_id][2]);
                   if (next_num > (curr_num + 1)) {
                        var expend_button_id = curr_inner_id.replace('inner_', 'expend_button_');
                        expend_button = '<input type="button" class="deleteresidues action_button" id="' + expend_button_id + '" value="Remove between '
                                      + hidden_record_map[curr_hidden_id][2] + ' and ' + hidden_record_map[next_hidden_id][2] + '" name="'
                                      + table_id + '" />';
                   }
              }
         }

         rows[i].cells[2].innerHTML = '<div id="' + curr_inner_id + '">' + delete_button + expend_button + '</div>';
    }
}

function check_submit() {
    if (Object.keys(insert_edit_button_set).length === 0) {
         $(':input[type="submit"]').attr('disabled', true);
    } else {
         $(':input[type="submit"]').removeAttr('disabled');
    }
}

$('.dblclick').live("click", function() {
    if ($(this).is('li')) {
        var idattr = $(this).attr('id');
        if (typeof idattr == 'undefined' || idattr == false) return;
        var idArr = idattr.split('_');
        if (idArr.length == 4) { 
             add_row(idattr, idArr, true);
             reset_deletion_button('edit_table_' + idArr[0] + '_' + idArr[1]);
        }
        check_submit();
    }
});

$('.deleteresidues').live("click", function() {
    var table_id = $(this).attr('name');
    var idArr = table_id.split('_');
    var entity_key = idArr[2] + '_' + idArr[3];
    if ((typeof(indexMap) === 'undefined') || !indexMap.hasOwnProperty(entity_key)) {
         alert("Sequence information index map not found.");
         return;
    }
    var value = $(this).attr('value');
    var arr = value.split(' ');
    var start = parseInt(arr[2]);
    var end = parseInt(arr[4]);
    if (indexMap[entity_key].hasOwnProperty(start) && indexMap[entity_key].hasOwnProperty(end)) {
        for (var i = start + 1; i < end; i++) {
             if (indexMap[entity_key].hasOwnProperty(i)) {
                 var idattr = entity_key + '_' + indexMap[entity_key][i];
                 var idArr = idattr.split('_');
                 add_row(idattr, idArr, false);
             }
        }
        reset_deletion_button(table_id);
        check_submit();
    } else alert("Sequence information index map not found.");
});

$('.deleterow').live("click", function() {
    var button_id = $(this).attr('id');
    var hidden_id = button_id.replace('delete_button_', 'hidden_');
    var table_id = $(this).attr('name');
    delete_row(table_id, $(this)[0].parentNode.parentNode.parentNode.rowIndex, hidden_id);
    reset_deletion_button(table_id);
    check_submit();
});

$('.deleteallrows').live("click", function() {
    var id = $(this).attr('id');
    var table_id = id.replace('delete_all_button_', 'edit_table_');
    var table = $('#'+table_id);
    var rows = table.find('tr');
    while (rows.length > 3) {
         var inner_id = $(rows[3].cells[2].innerHTML).attr('id');
         var hidden_id = inner_id.replace('inner_', 'hidden_');
         delete_row(table_id, 3, hidden_id);
         rows = table.find('tr');
    }
    check_submit();
});

$(document).ready(function() {
    var ajaxTimeout = 60000;

    var toolTipConfig = {fill: '#FFF',cornerRadius: 10,strokeWidth: 0,shadow: true,
                shadowOffsetX: 3,shadowOffsetY: 3,shadowBlur: 8,shadowColor: 'rgba(0,0,0,.9)',
        shadowOverlap: false,noShadowOpts: {strokeStyle: '#999',strokeWidth: 2},positions: ['top', 'left']};
        $.ajaxSetup({type: "POST",dataType: "json",async: true,timeout: ajaxTimeout,cache: false});

    $('.viewres').live('hover', function(){
        var idArr = $(this).attr('id').split('_');
        var text = 'Residue: ' + idArr[2] + '<br />' + 'Position: ' + idArr[3];
        $(this).bt(text, toolTipConfig);
    });

    check_submit();
});

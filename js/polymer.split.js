var hidden_count = 0;
var insert_split_button_set = {};

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

function insert_a_row(table, table_id, idArr, irow) {
    var row = table[0].insertRow(irow);
    for (var i = 0; i < 4; i++) {
        var cell = row.insertCell(i);
        cell.innerHTML = idArr[i + 2];
    }
    var cell = row.insertCell(4);

    var form = document.getElementById('split_form');
    var input = document.createElement('input');
    hidden_count += 1;
    var hidden_id = 'hidden_' + hidden_count;
    input.setAttribute('id', hidden_id);
    input.setAttribute('type', 'hidden');
    var name = 'split_' + idArr[1];
    input.setAttribute('name', name);
    var value = idArr[2] + '_' + idArr[3] + '_' + idArr[4] + '_' + idArr[5]; 
    input.setAttribute('value', value);
    form.appendChild(input);

    var n_terminal_button = '';
    var delete_button_id = 'delete_button_' + hidden_count;
    var delete_button = '<input type="button" class="deleterow action_button" id="' + delete_button_id + '" name="' + table_id + '" value="Remove" />';
    var c_terminal_button = '';

    if ((typeof(lengthMap) !== 'undefined') && (typeof(indexMap) !== 'undefined')) {
        var entity_key = idArr[0] + '_' + idArr[1]; 
        var res_num = parseInt(idArr[3]);
        if (res_num > 1) {
            var n_terminal_button_id = 'n_terminal_button_' + hidden_count;
            n_terminal_button = '<input type="button" class="splitall action_button" id="' + n_terminal_button_id + '" name="'
                              + entity_key + '" value="Split 1 to ' + idArr[3] + '" /> &nbsp; &nbsp; &nbsp;'
        }

        if (lengthMap.hasOwnProperty(entity_key)) {
            var length = lengthMap[entity_key];
            if (parseInt(idArr[5]) < length) {
                var c_terminal_button_id = 'c_terminal_button_' + hidden_count;
                c_terminal_button = ' &nbsp; &nbsp; &nbsp; <input type="button" class="splitall action_button" id="' + c_terminal_button_id + '" name="'
                                  + entity_key + '" value="Split ' + idArr[5] + ' to ' + length + '" />'
            }
        }
    }
    
    cell.innerHTML = '<div id="inner_' + hidden_count + '">' + n_terminal_button + delete_button + c_terminal_button + '</div>';

    if (insert_split_button_set.hasOwnProperty(table_id)) {
         insert_split_button_set[table_id].push(hidden_id);
    } else {
         insert_split_button_set[table_id] = [ hidden_id ];
    }
    $('#delete_all_' + idArr[0] + '_' + idArr[1]).removeClass("displaynone");
}

function reset_split_button(table) {
    var rows = table.find('tr');
    var irow = rows.length;
    if (rows.length < 5) {
        if (rows.length == 4) {
            var inner_id = $(rows[3].cells[4].innerHTML).attr('id');
            var n_terminal_button_id = inner_id.replace('inner_', 'n_terminal_button_');
            if ($('#' + n_terminal_button_id).length > 0) $('#' + n_terminal_button_id).removeClass("displaynone");
            var c_terminal_button_id = inner_id.replace('inner_', 'c_terminal_button_');
            if ($('#' + c_terminal_button_id).length > 0) $('#' + c_terminal_button_id).removeClass("displaynone");
        }
        return;
    }

    var inner_id = $(rows[3].cells[4].innerHTML).attr('id');
    var n_terminal_button_id = inner_id.replace('inner_', 'n_terminal_button_');
    if ($('#' + n_terminal_button_id).length > 0) $('#' + n_terminal_button_id).removeClass("displaynone");
    var c_terminal_button_id = inner_id.replace('inner_', 'c_terminal_button_');
    if ($('#' + c_terminal_button_id).length > 0) $('#' + c_terminal_button_id).addClass("displaynone");

    inner_id = $(rows[rows.length - 1].cells[4].innerHTML).attr('id');
    n_terminal_button_id = inner_id.replace('inner_', 'n_terminal_button_');
    if ($('#' + n_terminal_button_id).length > 0) $('#' + n_terminal_button_id).addClass("displaynone");
    c_terminal_button_id = inner_id.replace('inner_', 'c_terminal_button_');
    if ($('#' + c_terminal_button_id).length > 0) $('#' + c_terminal_button_id).removeClass("displaynone");

    for (var i = 4; i < rows.length - 1; i++) {
         inner_id = $(rows[i].cells[4].innerHTML).attr('id');
         n_terminal_button_id = inner_id.replace('inner_', 'n_terminal_button_');
         if ($('#' + n_terminal_button_id).length > 0) $('#' + n_terminal_button_id).addClass("displaynone");
         c_terminal_button_id = inner_id.replace('inner_', 'c_terminal_button_');
         if ($('#' + c_terminal_button_id).length > 0) $('#' + c_terminal_button_id).addClass("displaynone");
    }
}

function add_row(idattr, display_warning) {
    var idArr = idattr.split('_');
    if (idArr.length < 6) return;
    var table_id = 'split_table_' + idArr[0] + '_' + idArr[1];
    var table = $('#'+table_id);

    var irow = get_row_index(table, idArr, display_warning);
    if (irow < 0) return;

    insert_a_row(table, table_id, idArr, irow);
    reset_split_button(table);
}

function delete_row(table_id, row_index, hidden_id) {
    var table = document.getElementById(table_id);
    table.deleteRow(row_index);

    var form = document.getElementById('split_form');
    var input = document.getElementById(hidden_id);
    form.removeChild(input);

    if (insert_split_button_set.hasOwnProperty(table_id)) {
         var idx = insert_split_button_set[table_id].indexOf(hidden_id);
         if (idx > -1) insert_split_button_set[table_id].splice(idx, 1);
         if (insert_split_button_set[table_id].length == 0) delete insert_split_button_set[table_id];
    }

    if (!insert_split_button_set.hasOwnProperty(table_id)) {
         var delete_all_button = table_id.replace('split_table_', 'delete_all_');
         $('#' + delete_all_button).addClass("displaynone");
    }
    reset_split_button($('#'+table_id));
}

$('.dblclick').live("click", function() {
    if ($(this).is('li')) {
        var idattr = $(this).attr('id');
        if (typeof idattr == 'undefined' || idattr == false) return;
        add_row(idattr, true);
    }
});

$('.splitall').live("click", function() {
    var entity_key = $(this).attr('name');
    if ((typeof(indexMap) === 'undefined') || !indexMap.hasOwnProperty(entity_key)) {
         alert("Sequence information index map not found.");
         return;
    }
    var button_id = $(this).attr('id');
    var hidden_id = button_id.replace('n_terminal_button_', 'hidden_').replace('c_terminal_button_', 'hidden_');
    var value = $(this).attr('value');
    var arr = value.split(' ');
    var start = parseInt(arr[1]);
    var end = parseInt(arr[3]);
    if (indexMap[entity_key].hasOwnProperty(start) && indexMap[entity_key].hasOwnProperty(end)) {
        for (var i = start; i < end; i++) {
             if (indexMap[entity_key].hasOwnProperty(i)) {
                 add_row(entity_key + '_' + indexMap[entity_key][i], false);
             }
        }
    } else alert("Sequence information index map not found.");
});

$('.deleterow').live("click", function() {
    var button_id = $(this).attr('id');
    var hidden_id = button_id.replace('delete_button_', 'hidden_');
    var table_id = $(this).attr('name');
    delete_row(table_id, $(this)[0].parentNode.parentNode.parentNode.rowIndex, hidden_id);
});

$('.deleteallrows').live("click", function() {
    var id = $(this).attr('id');
    var table_id = id.replace('delete_all_button_', 'split_table_');
    var table = $('#'+table_id);
    var rows = table.find('tr');
    while (rows.length > 3) {
         var inner_id = $(rows[3].cells[4].innerHTML).attr('id');
         var hidden_id = inner_id.replace('inner_', 'hidden_');
         delete_row(table_id, 3, hidden_id);
         rows = table.find('tr');
    }
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
});

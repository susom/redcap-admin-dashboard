// tablesorter js
(function($, window, document) {
    // sort table when document is loaded
    $(document).ready(function () {
        $("#reportTable")
            .tablesorter({
                theme: UIOWA_AdminDash.theme,
                widthFixed: true,
                usNumberFormat: false,
                sortReset: false,
                sortRestart: true,
                widgets: ['zebra', 'filter', 'resizable', 'stickyHeaders', 'pager', 'output'],

                widgetOptions: {

                    // output default: '{page}/{totalPages}'
                    // possible variables: {size}, {page}, {totalPages}, {filteredPages}, {startRow}, {endRow}, {filteredRows} and {totalRows}
                    // also {page:input} & {startRow:input} will add a modifiable input in place of the value
                    pager_output: '{startRow:input} – {endRow} / {totalRows} rows', // '{page}/{totalPages}'

                    // apply disabled classname to the pager arrows when the rows at either extreme is visible
                    pager_updateArrows: true,

                    // starting page of the pager (zero based index)
                    pager_startPage: 0,

                    // Number of visible rows
                    pager_size: 10,

                    // Save pager page & size if the storage script is loaded (requires $.tablesorter.storage in jquery.tablesorter.widgets.js)
                    pager_savePages: true,

                    // if true, the table will remain the same height no matter how many records are displayed. The space is made up by an empty
                    // table row set to a height to compensate; default is false
                    pager_fixedHeight: false,

                    // remove rows from the table to speed up the sort of large tables.
                    // setting this to false, only hides the non-visible rows; needed if you plan to add/remove rows with the pager enabled.
                    pager_removeRows: false, // removing rows in larger tables speeds up the sort

                    // use this format: "http://mydatabase.com?page={page}&size={size}&{sortList:col}&{filterList:fcol}"
                    // where {page} is replaced by the page number, {size} is replaced by the number of records to show,
                    // {sortList:col} adds the sortList to the url into a "col" array, and {filterList:fcol} adds
                    // the filterList to the url into an "fcol" array.
                    // So a sortList = [[2,0],[3,0]] becomes "&col[2]=0&col[3]=0" in the url
                    // and a filterList = [[2,Blue],[3,13]] becomes "&fcol[2]=Blue&fcol[3]=13" in the url
                    pager_ajaxUrl: null,

                    // modify the url after all processing has been applied
                    pager_customAjaxUrl: function (table, url) {
                        return url;
                    },

                    // ajax error callback from $.tablesorter.showError function
                    // pager_ajaxError: function( config, xhr, settings, exception ){ return exception; };
                    // returning false will abort the error message
                    pager_ajaxError: null,

                    // modify the $.ajax object to allow complete control over your ajax requests
                    pager_ajaxObject: {
                        dataType: 'json'
                    },

                    // process ajax so that the following information is returned:
                    // [ total_rows (number), rows (array of arrays), headers (array; optional) ]
                    // example:
                    // [
                    //   100,  // total rows
                    //   [
                    //     [ "row1cell1", "row1cell2", ... "row1cellN" ],
                    //     [ "row2cell1", "row2cell2", ... "row2cellN" ],
                    //     ...
                    //     [ "rowNcell1", "rowNcell2", ... "rowNcellN" ]
                    //   ],
                    //   [ "header1", "header2", ... "headerN" ] // optional
                    // ]
                    pager_ajaxProcessing: function (ajax) {
                        return [0, [], null];
                    },

                    // css class names that are added
                    pager_css: {
                        container: 'tablesorter-pager',    // class added to make included pager.css file work
                        errorRow: 'tablesorter-errorRow', // error information row (don't include period at beginning); styled in theme file
                        disabled: 'disabled'              // class added to arrows @ extremes (i.e. prev/first arrows "disabled" on first page)
                    },

                    // jQuery selectors
                    pager_selectors: {
                        container: '.pager',       // target the pager markup (wrapper)
                        first: '.first',       // go to first page arrow
                        prev: '.prev',        // previous page arrow
                        next: '.next',        // next page arrow
                        last: '.last',        // go to last page arrow
                        gotoPage: '.gotoPage',    // go to page selector - select dropdown that sets the current page
                        pageDisplay: '.pagedisplay', // location of where the "output" is displayed
                        pageSize: '.pagesize'     // page size selector - select dropdown that sets the "size" option
                    },

                    //stickyHeaders_attachTo: '.redcap-home-navbar-collapse',
                    stickyHeaders_offset: 50,

                    output_separator     : ',',         // ',' 'json', 'array' or separator (e.g. ';')
                    output_ignoreColumns : '',         // columns to ignore [0, 1,... ] (zero-based index)
                    output_hiddenColumns : true,       // include hidden columns in the output
                    output_includeFooter : true,        // include footer rows in the output
                    output_includeHeader : true,        // include header rows in the output
                    output_headerRows    : false,       // output all header rows (if multiple rows)
                    output_dataAttrib    : 'data-name', // data-attribute containing alternate cell text
                    output_delivery      : 'd',         // (p)opup, (d)ownload
                    output_saveRows      : 'a',         // (a)ll, (v)isible, (f)iltered, jQuery filter selector (string only) or filter function
                    output_duplicateSpans: true,        // duplicate output data in tbody colspan/rowspan
                    output_replaceQuote  : '\u201c;',   // change quote to left double quote
                    output_includeHTML   : false,        // output includes all cell HTML (except the header cells)
                    output_trimSpaces    : true,       // remove extra white-space characters from beginning & end
                    output_wrapQuotes    : false,       // wrap every cell output in quotes
                    output_popupStyle    : 'width=580,height=310',
                    output_saveFileName  : UIOWA_AdminDash.csvFileName,
                    // callback executed after the content of the table has been processed
                    output_formatContent : function(config, widgetOptions, data) {
                        // data.isHeader (boolean) = true if processing a header cell
                        // data.$cell = jQuery object of the cell currently being processed
                        // data.content = processed cell content (spaces trimmed, quotes added/replaced, etc)
                        // data.columnIndex = column in which the cell is contained
                        // data.parsed = cell content parsed by the associated column parser
                        return data.content.replace(/ \[suspended]/ig, '').replace(/Email All/ig, '');
                    },
                    // callback executed when processing completes
                    output_callback      : function(config, data, url) {
                        // return false to stop delivery & do something else with the data
                        // return true OR modified data (v2.25.1) to continue download/output

                        if (config['widgetOptions']['output_delivery'] == 'd') {
                            data = '\ufeff' + data;
                        }

                        return data;
                    },
                    // callbackJSON used when outputting JSON & any header cells has a colspan - unique names required
                    output_callbackJSON  : function($cell, txt, cellIndex) {
                        return txt + '(' + cellIndex + ')';
                    },
                    // the need to modify this for Excel no longer exists
                    //output_encoding      : 'data:application/octet-stream;charset=utf8',
                    // override internal save file code and use an external plugin such as
                    // https://github.com/eligrey/FileSaver.js
                    output_savePlugin    : null /* function(config, widgetOptions, data) {
                     var blob = new Blob([data], {type: widgetOptions.output_encoding});
                     saveAs(blob, widgetOptions.output_saveFileName);
                     } */

                }

            })

        var $this = $(".output-button");

        $this.find('.dropdown-toggle').click(function(e) {
            // this is needed because clicking inside the dropdown will close
            // the menu with only bootstrap controlling it.
            $this.find('.dropdown-menu').toggle();
            return false;
        });
        // make separator & replace quotes buttons update the value
        $this.find('.output-separator').click(function() {
            $this.find('.output-separator').removeClass('active');
            var txt = $(this).addClass('active').html();
            $this.find('.output-separator-input').val( txt );
            var filename = $this.find('.output-filename');
            var filetype = (txt === 'json' || txt === 'array') ? 'js' :
                txt === ',' ? 'csv' : 'txt';
            filename.val(function(i, v) {
                // change filename extension based on separator
                return v.replace(/\.\w+$/, '.' + filetype);
            });
            var outputType = $($this.find('.output-type.active'))[0].innerText;
            if (outputType == 'Download') {
                $this.find('.download').html('<span class="fas fa-download"></span> Export ' + filetype.toUpperCase() + ' File');
            }
            else {
                $this.find('.download').html('<span class="far fa-window-maximize"></span> Open ' + filetype.toUpperCase() + ' Popup');
            }
            return false;
        });
        $this.find('.output-type').click(function() {
            var outputType = $(this)[0].innerText;
            var filename = $this.find('.output-filename');
            var txt = $($this.find('.output-separator.active')).html();
            var filetype = (txt === 'json' || txt === 'array') ? 'js' :
                txt === ',' ? 'csv' : 'txt';
            if (outputType == 'Download') {
                $this.find('.download').html('<span class="fas fa-download"></span> Export ' + filetype.toUpperCase() + ' File');
                $this.find('.filename-field-display').removeClass('hidden');
            }
            else {
                $this.find('.download').html('<span class="far fa-window-maximize"></span> Open ' + filetype.toUpperCase() + ' Popup');
                $this.find('.filename-field-display').addClass('hidden');
            }
            //return false;
        });
        // clicking the download button; all you really need is to
        // trigger an "output" event on the table
        $this.find('.download').click(function() {
            var typ,
                $table = $("#reportTable"),
                wo = $table[0].config.widgetOptions,
                val = $this.find('.output-filter-all :checked').attr('class');

            wo.output_saveRows     = val === 'output-filter' ? 'f' :
                val === 'output-visible' ? 'v' :
                    // checked class name, see table.config.checkboxClass
                    val === 'output-selected' ? '.checked' :
                        val === 'output-sel-vis' ? '.checked:visible' :
                            'a';
            val = $this.find('.output-download-popup :checked').attr('class');
            wo.output_delivery     = val === 'output-download' ? 'd' : 'p';
            wo.output_separator    = $this.find('.output-separator-input').val();
            //wo.output_replaceQuote = $this.find('.output-replacequotes').val();
            //wo.output_trimSpaces   = $this.find('.output-trim').is(':checked');
            //wo.output_includeHTML  = $this.find('.output-html').is(':checked');
            //wo.output_wrapQuotes   = $this.find('.output-wrap').is(':checked');

            var filename = $this.find('.output-filename').val();

            if ($this.find('.filename-datetime').is(':checked')) {
                var splitFilename = filename.split('.');
                splitFilename.splice(-1, 0, UIOWA_AdminDash.renderDatetime);
                wo.output_saveFileName = splitFilename.join('.');
            }
            else {
                wo.output_saveFileName = filename;
            }

            $table.trigger('outputTable');
            return false;
        });

        $(document).on('show.bs.modal', '.modal', function () {
            var zIndex = 1040 + (10 * $('.modal:visible').length);
            $(this).css('z-index', zIndex);
            setTimeout(function() {
                $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
            }, 0);
        });

        if (UIOWA_AdminDash.hideColumns) {
            for (var i in UIOWA_AdminDash.hideColumns) {
                $('#reportTable tr > *:nth-child(' + UIOWA_AdminDash.hideColumns[i] + ')').hide();
                $('#reportTable-sticky tr > *:nth-child(' + UIOWA_AdminDash.hideColumns[i] + ')').hide();
            }
        }

        UIOWA_AdminDash.updateReportTabs(UIOWA_AdminDash.userID);
    });

}(window.jQuery, window, document));

var UIOWA_AdminDash = {};

// generate pie chart with c3.js
UIOWA_AdminDash.createPieChart = function(id, type, data, options) {
    var ctx = document.getElementById(id).getContext('2d');

    var myChart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });

    //var chart = c3.generate({
    //    data: {
    //        json: json,
    //        type: 'pie'
    //    },
    //    title: {
    //        text: title
    //    },
    //    legend: {
    //        position: 'inset',
    //        width: '50%',
    //        inset: {
    //            anchor: 'top-right',
    //            x: 100,
    //            y: 0
    //        }
    //    },
    //    tooltip: {
    //        show: false
    //    },
    //    bindto: "#" + chartID
    //});
};

// flatten REDCap data json into counts
UIOWA_AdminDash.getCountsFromJson = function(json, column) {
    var countList = {};

    for (var i = 0; i < json.length; i++) {
        var currentValue = json[i][column] ? json[i][column] : "N/A"; // Value to be tallied

        if (!(currentValue in countList)) {
            countList[currentValue] = 1;
        }
        else {
            countList[currentValue]++;
        }
    }
    return countList;
};

UIOWA_AdminDash.updateSettingsModal = function(selectedUser) {

    $('.report-visibility-table tr').each(function () {
        var reportTitle = $(this).find('.table-report-title').html();

        if (reportTitle == undefined) {return;}

        var adminVisible = UIOWA_AdminDash.adminVisibility[reportTitle];
        var executiveVisible = $.inArray(selectedUser, UIOWA_AdminDash.executiveVisibility[reportTitle]) != -1;
        var adminToggle = $(this).find('.table-admin-visible input');
        var executiveToggle = $(this).find('.table-executive-visible input');
        var executiveToggleGroup = $(this).find('.table-executive-visible .toggle-off');

        if (selectedUser == '' || selectedUser == null) {
            executiveToggle.bootstrapToggle('off');

            executiveToggle.prop('disabled', true);
            executiveToggleGroup.addClass('disabled');
        }
        else {
            executiveToggle.prop('disabled', false);
            executiveToggleGroup.removeClass('disabled');

            executiveVisible ? executiveToggle.bootstrapToggle('on') : executiveToggle.bootstrapToggle('off');
        }

        adminVisible ? adminToggle.bootstrapToggle('on') : adminToggle.bootstrapToggle('off');

    });

    UIOWA_AdminDash.updateReportTabs(selectedUser);
};

UIOWA_AdminDash.updateReportSetupModal = function() {
    var index = UIOWA_AdminDash.currentReportConfigIndex;
    var reportInfo = UIOWA_AdminDash.reportReference[index];
    var nameInput = $('#reportName');
    var descInput = $('#reportDescription');
    var iconInput = $('#reportIcon');
    var idInput = $('#reportId');
    var customIdInput = $('#reportCustomId');

    //$('#reportConfiguration input').not('#reportCustomId').attr('readonly', false);
    $('#reportConfiguration input').attr('readonly', false);
    $('#reportConfiguration select').attr('disabled', false);
    editor.setReadOnly(false);
    $('.save-report').show();

    if (UIOWA_AdminDash.newReport) {
        nameInput.val('');
        descInput.val('');
        iconInput.val('question');
        iconInput.trigger('input');
        idInput.html(index);
        customIdInput.val('');
        editor.setValue('');
    }
    else {
        nameInput.val(reportInfo['reportName']);
        descInput.val(reportInfo['description']);
        iconInput.val(reportInfo['tabIcon']);
        iconInput.trigger('input');
        idInput.html(index);
        customIdInput.val(UIOWA_AdminDash.reportIDs[index]);
        editor.setValue(reportInfo['sql'] ? reportInfo['sql'] : '');

        if (reportInfo['readOnly']) {
            //$('#reportConfiguration input').not('#reportCustomId').attr('readonly', true);
            $('#reportConfiguration input').attr('readonly', true);
            $('#reportConfiguration select').attr('disabled', true);
            editor.setReadOnly(true);
            $('.save-report').hide();
        }
    }

    editor.clearSelection();
};

UIOWA_AdminDash.saveReportConfiguration = function() {
    var index = UIOWA_AdminDash.currentReportConfigIndex;
    var newReportTitle = $('#reportName').val();
    var reportRow = $('.table-report-title')[index];
    var reportNavTitle = $('.report-title')[index];
    var reportNavIcon = $('.report-icon')[index];
    var oldReportTitle = $(reportRow).html();

    $(reportRow).html(newReportTitle);
    $(reportNavTitle).html(newReportTitle);

    $(reportNavIcon).removeClass (function (index, className) {
        return (className.match (/(^|\s)fa-\S+/g) || []).join(' ');
    });
    $(reportNavIcon).addClass('fa-' + $('#reportIcon').val());

    UIOWA_AdminDash.reportReference[index] = {
        'reportName': newReportTitle,
        'description': $('#reportDescription').val(),
        'tabIcon': $('#reportIcon').val(),
        'customID': $('#reportCustomId').val(),
        'sql': editor.getValue(),
        'type': 'table'
};

    UIOWA_AdminDash.reportIDs[index] = $('#reportCustomId').val();

    if (!UIOWA_AdminDash.newReport) {
        UIOWA_AdminDash.adminVisibility = UIOWA_AdminDash.updateVisibilityReportTitle(
            UIOWA_AdminDash.adminVisibility,
            oldReportTitle,
            newReportTitle
        );
        UIOWA_AdminDash.executiveVisibility = UIOWA_AdminDash.updateVisibilityReportTitle(
            UIOWA_AdminDash.executiveVisibility,
            oldReportTitle,
            newReportTitle
        );
    }
    else {
        UIOWA_AdminDash.adminVisibility[newReportTitle] = false;
        UIOWA_AdminDash.executiveVisibility[newReportTitle] = [];
    }

    UIOWA_AdminDash.saveReportSettingsToDb('all');
};

UIOWA_AdminDash.updateVisibilityReportTitle = function(array, oldTitle, newTitle) {
    if (oldTitle !== newTitle) {
        Object.defineProperty(array, newTitle,
            Object.getOwnPropertyDescriptor(array, oldTitle));
        delete array[oldTitle];
    }

    return array;
};

UIOWA_AdminDash.createReportRow = function(reportName) {
    return $(
        '<tr>' +
            '<td class="table-report-title" style="text-align:right; vertical-align:middle; padding-right:10px">'+
                reportName +
            '</td>' +
            '<td style="text-align:left; vertical-align:middle;">' +
                '<button type="button" class="btn btm-sm btn-primary open-report-setup report-settings-button" aria-haspopup="true" aria-expanded="false" data-toggle="modal" data-target="#reportSetupModal">' +
                    '<i class="fas fa-edit"></i>' +
                    '<span class="sr-only">Edit report</span>' +
                '</button>' +
                //'<button type="button" class="btn btm-sm btn-success report-settings-button" aria-haspopup="true" aria-expanded="false" data-target="#" onclick="UIOWA_AdminDash.copyReport(this)">' +
                //    '<i class="fas fa-copy"></i>' +
                //    '<span class="sr-only">Copy report</span>' +
                //'</button>' +
                '<button type="button" class="btn btm-sm btn-danger report-settings-button custom-report-only" aria-haspopup="true" aria-expanded="false" data-target="#" onclick="UIOWA_AdminDash.deleteReport(this)">' +
                    '<i class="fas fa-trash"></i>' +
                    '<span class="sr-only">Delete report</span>' +
                '</button>' +
            '</td>' +
            '<td class="table-admin-visible" style="text-align:center">' +
                '<input type="checkbox" data-toggle="toggle" data-width="75" data-on="Show" data-off="Hide">' +
            '</td>' +
            '<td class="table-executive-visible" style="text-align:center">' +
                '<input type="checkbox" data-toggle="toggle" data-width="75" data-on="Show" data-off="Hide">' +
            '</td>' +
        '</tr>'
    );
};

//todo add to reportReference
UIOWA_AdminDash.copyReport = function(copyLink) {
    var copyReportRow = $(copyLink).closest('tr');
    var addButtonRow = $('.add-report-button').closest('tr');
    var reportName = $('.table-report-title', copyReportRow).text();
    var existingReportCopy = $.inArray(reportName, UIOWA_AdminDash.reportReference) != -1;

    if (!existingReportCopy) {
        var reportRow = $(UIOWA_AdminDash.createReportRow(reportName + ' (Copy)')).insertBefore(addButtonRow);

        $('input', reportRow).bootstrapToggle();

        var reportInfoCopy = $.grep(UIOWA_AdminDash.reportReference, function (report) {
            return report['reportName'] == reportName;
        })[0];

        reportInfoCopy['reportName'] = reportName + ' (Copy)';
        delete reportInfoCopy['defaultVisibility'];
        delete reportInfoCopy['readOnly'];

        UIOWA_AdminDash.reportReference.push(reportInfoCopy);

        UIOWA_AdminDash.saveReportSettingsToDb('reports');


    }
    else {
        alert('A copy of this report already exists. Please rename the original copy before creating another.')
    }

    //
    //var reportNav = $('.report-title').filter(function () {
    //    return $(this).html() == reportName;
    //}).closest('li').first();
    //
    //reportRow.remove();
    //reportNav.remove();
    //UIOWA_AdminDash.saveReportSettingsToDb('reports');
};

UIOWA_AdminDash.deleteReport = function(deleteLink) {
    var reportRow = $(deleteLink).closest('tr');
    var reportName = $('.table-report-title', reportRow).text();

    var confirmed = confirm('Are you sure you want to delete ' + reportName + '?');

    if (confirmed) {
        UIOWA_AdminDash.reportReference = $.grep(UIOWA_AdminDash.reportReference, function (report) {
            return report['reportName'] != reportName;
        });

        UIOWA_AdminDash.reportIDs.splice(reportRow.index());
        delete UIOWA_AdminDash.adminVisibility[reportName];
        delete UIOWA_AdminDash.executiveVisibility[reportName];

        var reportNav = $('.report-title').filter(function () {
            return $(this).html() == reportName;
        }).closest('li').first();

        reportRow.remove();
        reportNav.remove();
        UIOWA_AdminDash.saveReportSettingsToDb('all');
    }
};

//UIOWA_AdminDash.archiveReport = function(archiveLink) {
//    var reportRow = $(archiveLink).closest('tr');
//    var settingsButton = $('button', reportRow);
//    var settingsButtonIcon = $('button > i', reportRow);
//
//    settingsButton.removeClass('btn-primary');
//    settingsButton.addClass('btn-warning');
//
//    settingsButtonIcon.removeClass();
//    settingsButtonIcon.addClass('fas fa-eye-slash');
//
//    reportRow.hide();
//};
//
//UIOWA_AdminDash.toggleArchivedReports = function() {
//    UIOWA_AdminDash.showArchivedReports = !UIOWA_AdminDash.showArchivedReports;
//
//    $('.report-visibility-table tr').each(function () {
//        var reportName = $('td', this).html();
//
//        if (UIOWA_AdminDash.showArchivedReports == true) {
//            $(this).show();
//        }
//        else if (UIOWA_AdminDash.showArchivedReports == false) {
//            if ($.inArray(reportName, UIOWA_AdminDash.archivedReports) != -1) {
//                $(this).hide();
//            }
//        }
//    });
//};

UIOWA_AdminDash.updateReportTabs = function(user) {
    var keys = Object.keys(UIOWA_AdminDash.adminVisibility);

    for (var i in keys) {
        var reportTitle = keys[i];
        var adminVisible = UIOWA_AdminDash.adminVisibility[reportTitle];
        var executiveVisible = $.inArray(user, UIOWA_AdminDash.executiveVisibility[reportTitle]) != -1;
        var reportTab = $('.report-tabs > li ').filter(function() {
            return $('.report-title', this).text() === reportTitle;
        });

        if (!adminVisible && !UIOWA_AdminDash.executiveAccess) {
            reportTab.hide();
        }
        else if (!executiveVisible && UIOWA_AdminDash.executiveAccess) {
            reportTab.hide();
        }
        else {
            reportTab.show();
        }
    }
};

UIOWA_AdminDash.saveReportSettingsToDb = function(type) {
    var customReports = $.grep(UIOWA_AdminDash.reportReference, function(report) {
        if ($.inArray(report['reportName'], UIOWA_AdminDash.defaultReportNames) == -1) {
            return report;
        }
    });

    if (customReports.length == 0) {
        customReports = 'none';
    }

    var allSettings = JSON.stringify({
        'reportReference': type == 'all' || type == 'reports' ? customReports : null,
        'adminVisibility': type == 'all' || type == 'visibility' ? UIOWA_AdminDash.adminVisibility : null,
        'executiveVisibility': type == 'all' || type == 'visibility' ? UIOWA_AdminDash.executiveVisibility : null
    });

    //var request = new XMLHttpRequest();
    //request.open("POST", UIOWA_AdminDash.saveSettingsUrl, true);
    //request.setRequestHeader("Content-type", "application/json");
    //request.send(allSettings);

    $.ajax({
            method: 'POST',
            url: UIOWA_AdminDash.saveSettingsUrl,
            data: allSettings
        })
        .done(function() {
            if (UIOWA_AdminDash.loadReportAfterSave) {
                window.location.href = UIOWA_AdminDash.lastSavedReportUrl;
            }
        })
};
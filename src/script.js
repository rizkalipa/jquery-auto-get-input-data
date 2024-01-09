/**
 * 
 * @param {string} tableId
 * @param {string} containerId 
 * @returns {Array}
 * 
 */
function formatInputData(table, containerId = 'container-table-data') {
    var rows = $(table).find('tr')
    var result = []

    $.each(rows, function (index, row) {
        $(row).find('input, select').each((index, item) => { $(item).attr('value', item.value) })
    })

    $.each(rows, function (index, row) {
        let data = {}

        $(row).find('input, select').each((index, item) => {
            let rowData = $(item)
            let inputName = rowData.attr('name')
            data[inputName] = rowData.val()

            rowData.removeClass('is-invalid')

            if (!rowData.val() && rowData.data('is-required')) {
                Notification.error(`Field ${inputName} tidak boleh kosong.`)
                rowData.addClass('is-invalid')

                throw new Error("Error Input")

            }

            if (rowData.data('is-unique')) {
                let values = []
                let duplicates = []

                $(`#${containerId}`).find(`input[name="${inputName}"][data-is-unique="true"], select[name="${inputName}"][data-is-unique="true"]`).each(function (index, item) {
                    values.push(item.value)
                })

                duplicates = values.filter((item, index) => values.indexOf(item) !== index)

                if (duplicates.length) {
                    Notification.error(`Field ${inputName} tidak boleh duplikat.`)
                    $(`#${containerId}`).find(`input[name="${inputName}"][value="${duplicates[0]}"][data-is-unique="true"], select[name="${inputName}"][value="${duplicates[0]}"][data-is-unique="true"]`).addClass('is-invalid')

                    throw new Error("Error Input")
                }
            }
        })

        if (Object.keys(data).length) result.push(data)
    })

    return result
}
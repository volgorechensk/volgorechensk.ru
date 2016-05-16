(function($) {
    function getRandom(n) {
        return Math.floor(Math.random() * n);
    }

    function stripSpaces(text) {
        return text.replace(/[ \r\n\t]/g, '');
    }

    function escapeHTML(text) {
        return String(text || '')
            .replace(/\&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    $(document).ready(function() {
        var PATH = 'data.php',
            $add = $('.border__add'),
            $addForm = $('.border__add-form'),
            $border = $('.border'),
            $messages = $('.border__messages'),
            $input = $('.border__input'),
            $submit = $('.border__submit'),
            $sorted = $('.border__sorted'),
            $unsorted = $('.border__unsorted');

        function buildMessages(data) {
            var html = '',
                len = data.length;

            for (var i = 0; i < len; i++) {
                var item = data[i];
                html += '<div class="message message_color_' +
                    item.color +
                    '" style="left: ' + item.x +
                    '%; top: ' + item.y +
                    'px; z-index: ' + (len - i) + '">' +
                    escapeHTML(item.text) + '</div>';
            }

            $messages.html(html);
        }

        function updateInput() {
            $submit[0].disabled = !Boolean(getVal());
        }

        function getVal() {
            return $.trim($input.val());
        }

        $.get(PATH, function(data) {
            buildMessages(data || []);
        });

        $messages.on('click', '.message', function() {
            $('.message_top').removeClass('message_top');
            $(this).addClass('message_top');
        });

        $add.click(function() {
            $addForm.toggle();
            $input.focus();

            updateInput();
        });

        $input.on('keydown', function(e) {
            updateInput();

            if (e.keyCode === 13 && !$submit[0].disabled) {
                $submit.click();
            }
        });

        $sorted.click(function() {
            $border.addClass('border_sorted');
        });

        if (window.location.hash === '#sorted') {
            $sorted.click();
        }

        $unsorted.click(function() {
            $border.removeClass('border_sorted');
        });

        $(document).keydown(function(e) {
            if (e.keyCode === 27) { // ESC
                $addForm.hide();
            }
        })

        $submit.click(function() {
            var text = getVal();

            $add.hide();
            $input.val('');
            $addForm.hide();

            $.post(PATH + '?action=save', {
                text: text
            }, function(data) {
                data && data.length && buildMessages(data);

                $add.show();
            });
        });
    });
})(jQuery);
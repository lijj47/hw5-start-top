xmlhttpreq = null

class Button
	@buttons = []
	@sum = 0

	@reset = !->
		@sum = 0
		for button in @buttons
			button.state = 'enabled'
			button.button-dom.remove-class 'disabled waiting done' .add-class 'enabled'
			button.button-dom.find '.unread' .text '...'

	(@button-dom) ->
		@state = 'enabled'
		@button-dom.add-class 'enabled'
		@button-dom.click !~> if @state is 'enabled'
			@disable-all-other-buttons!
			@wait!
			@get-random-number-and-show!
		@@@buttons.push @

	disable-all-other-buttons: -> [button.disable! for button in @@@buttons when button isnt @ and button.state isnt 'done']
	
	enable-all-other-buttons: -> [button.enable! for button in @@@buttons when button isnt @ and button.state isnt 'done']

	show-number: (number)!-> @button-dom.find '.unread' .text number

	check-if-all-buttons-are-done: !->
		[return false for button in @@@buttons when button.state isnt 'done']
		bubble = $ '#info-bar'
		bubble.remove-class 'disabled' .add-class 'enabled'

	get-random-number-and-show: -> xmlhttpreq := $.get '/api/random', (number, result)!~>
		@done!
		@enable-all-other-buttons!
		@show-number number
		@@@sum += parse-int number
		@check-if-all-buttons-are-done!

	disable: !-> @state = 'disabled'; @button-dom.remove-class 'enabled' .add-class 'disabled'
	
	enable: !-> @state = 'enabled'; @button-dom.remove-class 'disabled' .add-class 'enabled'
	
	wait: !-> @state = 'waiting'; @button-dom.remove-class 'enabled' .add-class 'waiting'
	
	done: !-> @state = 'done'; @button-dom.remove-class 'waiting' .add-class 'done'


$ ->
	click-button-to-get-random-number!
	click-bubble-to-calculate-sum!
	reset-when-leaving-apb!

click-button-to-get-random-number = ->
	for let dom, i in $ '#control-ring .button'
		button = new Button ($ dom)

click-bubble-to-calculate-sum = ->
	bubble = $ '#info-bar'
	bubble.add-class 'disabled'
	bubble.click !-> if bubble.has-class 'enabled'
		bubble.remove-class 'enabled' .add-class 'disabled'
		bubble.find '.amount' .text (parse-int Button.sum)

reset-when-leaving-apb = ->
	$ '#at-plus' .on 'mouseleave' (event)!->
		if xmlhttpreq then xmlhttpreq.abort!
		Button.reset!
		bubble = $ '#info-bar'
		bubble.remove-class 'enabled' .add-class 'disabled'
		bubble.find '.amount' .text ''

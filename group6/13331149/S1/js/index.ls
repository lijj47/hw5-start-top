class Button
	/*
	 *	@state: 按钮的状态
	 *	@buttons：按钮对象
	 *  @disable：使按钮不能点击
	 *	@enable ：按钮回复点击功能
	 *	@reset ：重置按钮状态
	 *	@visible：让数字小红圈显示
	 *	@show-number ：将数字显示在小红圈中
	 *	@wait：转换按钮为wating状态
	 *	@done:转换按钮为done状态
	 *	@get-number-and-show-it：发送请求，获得数字，并显示
	 *
	 */
	state = void
	button = void

	(@button, @success-info, @faild-info)->
		@state = 'enabled'
		@button.add-class 'enabled'
		@button.click !~> if @state is 'enabled'
			Control-Ring.disable-all-other-buttons @
			@visible!
			@wait!
			@get-number-and-show-it!

	disable: !-> @button.remove-class 'enabled' .add-class 'disabled'; @state = 'disable'

	enable: !-> @button.remove-class 'disabled' .add-class 'enabled'; @state = 'enabled'

	reset: !-> 
		@button.remove-class 'disabled done' .add-class 'enabled'; @state = 'enabled'
		@button.find '.unread' .remove-class 'visible'
	
	visible: !-> @button.find '.unread' .add-class 'visible' .text '...'

	show-number: (number)!-> @button.find '.unread' .text number

	wait: !-> @button.remove-class 'enabled' .add-class 'waiting'; @state = 'waiting'

	done: !->  @button.remove-class 'waiting' .add-class 'done disabled'; @state = 'done'

	get-number-and-show-it: !-> $.get '/', (number, result) !~>
		@done!
		@show-number number
		info-bar.add-num parse-int number
		info-bar.enable-info-bar! if Control-Ring.if-all-button-is-done!
		Control-Ring.enable-all-other-buttons @

class Control-Ring
	/*
	 *	@buttons: Control-Ring中的5个button
	 *  @enable-all-other-buttons：使其他非done状态的button恢复点击
	 *	@disable-all-other-buttons： 使其他按钮不能点击
	 *	@if-all-button-is-done ：判断是否5个按钮都为done状态
	 *	@reset-all-buttons： 重置所有按钮的状态
	 *
	 */
	@buttons = []

	(@buttons, @success-infos, @faild-infos)->
		for let button, i in  buttons
			button = new Button ($ button), success-infos[i], faild-infos[i]
			@@@buttons.push button
	
	@enable-all-other-buttons = (this-button)->[button.enable! for button in @buttons when button isnt this-button and button.state isnt 'done' ]
	
	@disable-all-other-buttons = (this-button)->[button.disable! for button in @buttons when button isnt this-button and button.state isnt 'done']
	
	@reset-all-buttons = -> [button.reset! for button in @buttons]

	@if-all-button-is-done = ->[return false for button in @buttons when button.state isnt 'done']; true

class info-bar
	/*
	 *  @bar: info-bar的对象
	 * 	@sum: 记录当前所有数字之和
	 *	@enable-info-bar: 激活info-bar
	 *  @disable-info-bar： 灭活info-bar
	 *	@reset： 重置info-bar
	 *
	 */

	(@bar, @sum=0)->
		@@@bar = @bar
		@@@sum = @sum
		@bar.add-class 'disabled'
		@bar.click !~>  #不能用 ->
			if @bar.has-class 'enabled'
				@bar.find '.sum' .add-class 'visible' .text info-bar.sum
				@bar.remove-class 'enabled'
				@bar.add-class 'disabled'

	@enable-info-bar = -> @bar.remove-class 'disabled' .add-class 'enabled'

	@disable-info-bar = -> @bar.remove-class 'enabled' .add-class 'disabled'

	@add-num = (number)-> @sum += number

	@reset = -> 
		@bar.remove-class 'enabled' .add-class 'disabled'
		@bar.find '.sum' .remove-class 'visible'
		@sum = 0

init-all-buttons = ~>
	#初始化所有按钮,info-bar和apb
	success-infos = ['这是个天大的秘密', '我不知道', '你不知道', '他不知道', '才怪']
	faild-infos = ['这不是个天大的秘密', '我知道', '你知道', '他知道', '才怪']
	control-ring = new Control-Ring ($ '#control-ring .button'), success-infos, faild-infos
	bar = new info-bar ($ '#info-bar')
	@apc = $ '#at-plus-container'

reset-all-button-when-mouse-leave-apb = ->
	@apc.on 'mouseleave' (event)!~>info-bar.reset!; Control-Ring.reset-all-buttons!
	@apc.on 'mouseenter' (event)!~>
		set-timeout !-> 
			info-bar.reset!; Control-Ring.reset-all-buttons!
		, 500


$ ->
	init-all-buttons!
	reset-all-button-when-mouse-leave-apb!
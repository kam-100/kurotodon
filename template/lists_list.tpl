	{foreach item=item from=$items}
	<div class='item' list_id='{$item->id}'>
		<div class='container'>
			<div class='fullname' display_name='{$item->user->display_name}' id='{$item->id}' title='{$item->title}'>
				<span>@{$item->title}</span>
			</div>
		</div>
		<div class='buttons'>
			<a class='btn show'>(i18n_9996)</a>
		</div>
	</div>
	{/foreach}

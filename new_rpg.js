function main(){
	
}

function DisplayHelper()
{}
{
	DisplayHelper.prototype.clear = function()
	{
		this.graphics.fillStyle = "White";
		this.graphics.fillRect
		(
			0, 0,
			this.viewSizeInPixels.x,
			this.viewSizeInPixels.y
		);

		this.graphics.strokeStyle = "Black";
		this.graphics.strokeRect
		(
			0, 0,
			this.viewSizeInPixels.x,
			this.viewSizeInPixels.y
		);
	}

	DisplayHelper.prototype.drawAgent = function(agent)
	{
		var agentDefn = agent.defn();
		this.graphics.strokeStyle = agentDefn.color;
		this.graphics.strokeRect
		(
			agent.pos.x,
			agent.pos.y,
			agentDefn.sizeInPixels.x,
			agentDefn.sizeInPixels.y
		);

		this.graphics.fillStyle = agentDefn.color;

		if (agent.name != null)
		{
			this.graphics.fillText
			(
				agent.name,
				agent.pos.x,
				agent.pos.y + agentDefn.sizeInPixels.y - 10
			);
		}

		this.graphics.fillText
		(
			agentDefn.name,
			agent.pos.x,
			agent.pos.y + agentDefn.sizeInPixels.y
		);

		var encounter = Globals.Instance.universe.encounter;
		var agentCurrent = encounter.agentCurrent;

		if (agent == agentCurrent)
		{
			var arrowSizeInPixels = agent.defn().sizeInPixels;

			this.drawArrow
			(
				agent.pos,
				arrowSizeInPixels
			);

			var action = agent.action;
			if (action != null)
			{
				var actionTarget = action.target();

				if (actionTarget != null)
				{
					this.drawArrow
					(
						actionTarget.pos,
						arrowSizeInPixels
					);
				}
			}
		}

	}

	DisplayHelper.prototype.drawArrow = function(pos, size)
	{
		this.graphics.strokeStyle = "Black";
		this.graphics.beginPath();
		this.graphics.moveTo(pos.x, pos.y + size.y / 2);
		this.graphics.lineTo(pos.x - size.x, pos.y);
		this.graphics.lineTo(pos.x - size.x, pos.y + size.y);
		this.graphics.closePath();
		this.graphics.stroke();
	}

	DisplayHelper.prototype.drawEncounter = function(encounter)
	{
		this.clear();

		var encounterDefn = encounter.defn();
		var panes = encounterDefn.panes;

		for (var p = 0; p < panes.length; p++)
		{
			var pane = panes[p];
			this.drawPane(pane);
		}

		var entities = encounter.entities;
		for (var i = 0; i < entities.length; i++)
		{
			var entity = entities[i];

			if (entity.drawToDisplayHelper != null)
			{
				entity.drawToDisplayHelper(this);
			}
		}
	}

	DisplayHelper.prototype.drawMenu = function(menu)
	{
		var pos = menu.pos;
		var spacing = menu.spacing;

		var arrowSize = new Coords(8, 8);
		var drawPos = pos.clone().add
		(
			new Coords(arrowSize.x + 2, spacing.y / 2)
		);

		var children = menu.children;

		if (children != null)
		{
			for (var i = 0; i < children.length; i++)
			{
				var child = children[i];
				var displayText = child.text;
				this.drawText
				(
					displayText,
					drawPos
				);
		
				drawPos.y += arrowSize.y / 3; // hack
	
				if (i == menu.indexOfChildSelected)
				{
					this.drawArrow
					(
						drawPos, // pos - hack
						arrowSize // size
					);
				}

				drawPos.y -= arrowSize.y / 3; // hack
	
				drawPos.add(spacing);

			} // end for
		}
	}

	DisplayHelper.prototype.drawPane = function(pane)
	{
		this.graphics.strokeStyle = "Black";
		this.graphics.strokeRect
		(
			pane.pos.x,
			pane.pos.y,
			pane.size.x,
			pane.size.y
		);

		this.graphics.fillStyle = "Black";

	}

	DisplayHelper.prototype.drawPartyWithStatusPane = function(party, paneForStatus)
	{
		var menuForParty = new Menu
		(
			"Party",
			paneForStatus.pos,
			new Coords(0, 8), // spacing
			null, // updateEncounter
			party, // menuable
			Menu.menuablesToMenus
			(
				party.agents,
				[ "name", "integrity", "defn().integrityMax" ], // bindingPathsForDisplayText
				null // updateEncounter
			)
		)

		menuForParty.drawToDisplayHelper(this);
	}

	DisplayHelper.prototype.drawText = function(textToDraw, pos)
	{
		this.graphics.fillText
		(
			textToDraw,
			pos.x + 2, // hack
			pos.y + 10 // hack
		);
	}

	DisplayHelper.prototype.initialize = function(viewSizeInPixels)
	{
		this.viewSizeInPixels = viewSizeInPixels;

		var canvas = document.createElement("canvas");
		canvas.width = this.viewSizeInPixels.x;
		canvas.height = this.viewSizeInPixels.y;
		this.graphics = canvas.getContext("2d");
		this.graphics.font = "8px sans-serif";

		document.body.appendChild(canvas);
	}
}
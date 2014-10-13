// main
function main()
{
	var categories = 
	[
		new Category("Consumable"),
		new Category("Weapon"),
	];

	categories.addLookups("name");

	var effectDefns = [];

	var itemDefns = 
	[
		// consumables

		new ItemDefn
		(
			"Heal Potion", 
			[ categories["Consumable"].name ], 
			// apply
			function(item, agent, target) 
			{ 
				var items = agent.itemsInInventory;
				items.splice
				(
					items.indexOf(item),
					1
				);
				target.integrity += 20; 
			}
		),

		new ItemDefn
		(
			"Energy Potion", 
			[ categories["Consumable"].name ], 
			// apply
			function(item, agent, target) 
			{ 
				var items = agent.itemsInInventory;
				items.splice
				(
					items.indexOf(item),
					1
				);
				target.energy += 20; 
			}
		),

		// weapons

		new ItemDefn
		(
			"Dagger", 
			[ categories["Weapon"].name ],
			// apply 
			function(item, agent, target) 
			{ 
				target.integrity -= 2;
			}
		),

		new ItemDefn
		(
			"Mace", 
			[ categories["Weapon"].name ], 
			// apply
			function(item, agent, target) 
			{ 
				target.integrity -= 6;
			}
		),

		new ItemDefn
		(
			"Sword", 
			[ categories["Weapon"].name ], 
			// apply
			function(item, agent, target) 
			{ 
				target.integrity -= 10;
			}
		),
	];

	itemDefns.addLookups("name");

	var actionDefnsCommon = 
	[
		new ActionDefn
		(
			"Attack",
			true, // requiresTarget
			function(encounter, agent, action)
			{
				var target = action.target();
				var displacementFromAgentToTarget = target.pos.clone().subtract
				(
					agent.pos
				);

				var distanceToTarget = displacementFromAgentToTarget.magnitude();

				var distanceToMovePerTick = 16;
				
				if (distanceToTarget > distanceToMovePerTick)
				{
					var displacementToMove = displacementFromAgentToTarget.divideScalar
					(
						distanceToTarget
					).multiplyScalar
					(
						distanceToMovePerTick
					);

					agent.pos.add(displacementToMove);
				}
				else
				{	
					var emptyToReturnTo = action.parameters["EmptyForPosToReturnTo"];					

					if (target.integrity == null)
					{
						agent.pos.overwriteWith(emptyToReturnTo.pos);
						action.target_Set(null);
						action.status = ActionStatus.Instances.Complete;
					}
					else
					{
						var weaponEquipped = agent.itemsEquipped["Weapon"];
						if (weaponEquipped != null)
						{
							weaponEquipped.apply
							(
								agent,
								target
							);
						}
						action.target_Set(emptyToReturnTo);
					}
				}
			},
			null // toMenu
		),

		new ActionDefn
		(
			"Defend",
			false, // requiresTarget
			function(encounter, agent, action)
			{
				action.status = ActionStatus.Instances.Complete;
			},
			null // toMenu
		),

		new ActionDefn
		(
			"Magic",
			true, // requiresTarget
			// updateEncounter
			function(encounter, agent, action)
			{
				action.status = ActionStatus.Instances.Complete;
			},
			// toMenu
			function()
			{
				var universe = Globals.Instance.universe;
				var encounter = universe.encounter;
				var panes = encounter.defn().panes;
				var agent = encounter.agentCurrent;
				var spellDefns = agent.defn().spellDefns;

				var returnMenu = new Menu
				(
					"Magic",
					panes["Menu_Player"].pos, // pos
					new Coords(0, 8), // spacing
					null, // menuable
					null, // updateEncounter
					Menu.menuablesToMenus
					(
						spellDefns,
						[ "name" ], // bindingPathsForMenuText
						function (encounter) 
						{ 
							var spellDefn = this.menuable;
							var agent = encounter.agentCurrent;
							var action = agent.action;
							action.parameters["SpellDefn"] = spellDefn;
							action.defnName = "Spell";
							action.status = ActionStatus.Instances.AwaitingTarget;
						}
					),
					0 // indexOfChildSelected
				);

				return returnMenu;
			}
		),

		new ActionDefn
		(
			"Spell",
			true, // requiresTarget
			function(encounter, agent, action)
			{
				var target = action.target();
				var displacementFromAgentToTarget = target.pos.clone().subtract
				(
					agent.pos
				);

				var distanceToTarget = displacementFromAgentToTarget.magnitude();

				var distanceToMovePerTick = 16;
				
				if (distanceToTarget > distanceToMovePerTick)
				{
					var displacementToMove = displacementFromAgentToTarget.divideScalar
					(
						distanceToTarget
					).multiplyScalar
					(
						distanceToMovePerTick
					);

					agent.pos.add(displacementToMove);
				}
				else
				{	
					var emptyToReturnTo = action.parameters["EmptyForPosToReturnTo"];					

					if (target.integrity == null)
					{
						agent.pos.overwriteWith(emptyToReturnTo.pos);
						action.target_Set(null);
						action.status = ActionStatus.Instances.Complete;
					}
					else
					{
						var spellDefn = action.parameters["SpellDefn"];
						spellDefn.apply
						(
							agent,
							target
						);
						action.target_Set(emptyToReturnTo);
					}
				}
			},
			null // toMenu
		),

		new ActionDefn
		(
			"Item",
			false, // requiresTarget
			function(encounter, agent, action)
			{
				action.status = ActionStatus.Instances.Complete;
			},
			// toMenu
			function()
			{
				var universe = Globals.Instance.universe;
				var encounter = universe.encounter;
				var panes = encounter.defn().panes;
				var agent = encounter.agentCurrent;
				var items = agent.itemsInInventory;

				var returnMenu = new Menu
				(
					"Items",
					panes["Menu_Player"].pos, // pos
					new Coords(0, 8), // spacing
					null, // menuable
					null, // updateEncounter
					Menu.menuablesToMenus
					(
						items,
						[ "defn().name" ], // bindingPathsForMenuText
						function (encounter) 
						{ 
							var item = this.menuable;
							var agentCurrent = encounter.agentCurrent;
							var target = agentCurrent.action.target();
							item.apply(agentCurrent, target);
						}
					),
					0 // indexOfChildSelected
				);

				return returnMenu;
			}
		),

		new ActionDefn
		(
			"Wait",
			false, // requiresTarget
			function(encounter, agent, action)
			{
				encounter.agentCurrentAdvance();
			},
			null // toMenu
		),

		new ActionDefn
		(
			"Run",
			false, // requiresTarget
			function(encounter, agent, action)
			{
				// todo
				action.status = ActionStatus.Instances.Complete;
			},
			null // toMenu  
		),
	];

	actionDefnsCommon.addLookups("name");

	var agentSizeInPixelsStandard = new Coords(24, 24);

	var agentDefns = 
	[
		new AgentDefn
		(
			"Mage", 
			"Black",
			agentSizeInPixelsStandard,
			10, //integrityMax,
			20, //energyMax,
			new Range(1, 10), // initiativeRange
			//actionDefns
			[
				actionDefnsCommon["Attack"],
				actionDefnsCommon["Magic"],
				actionDefnsCommon["Item"],
				actionDefnsCommon["Wait"],
			],
			// spellDefns
			[
				new SpellDefn
				(
					"Fire",
					// apply 
					function(agent, target) 
					{ 
						agent.energy -= 5;
						target.integrity -= 20;
					} 
				),
			]
		),	

		new AgentDefn
		(
			"Priest", 
			"Black",
			agentSizeInPixelsStandard,
			20, //integrityMax,
			20, //energyMax,
			new Range(1, 10), // initiativeRange
			//actionDefns
			[
				actionDefnsCommon["Attack"],
				actionDefnsCommon["Magic"],
				actionDefnsCommon["Item"],
				actionDefnsCommon["Wait"],
			],
			// spellDefns
			[
				new SpellDefn
				(
					"Heal",
					// apply 
					function(agent, target) 
					{ 
						agent.energy += 5;
						var integrityToHeal = 20;
						target.integrity = NumberHelper.trimValueToMinAndMax
						(
							target.integrity + integrityToHeal,
							0, // min
							target.defn().integrityMax // max
						);
					} 
				),
			]
		),

		new AgentDefn
		(
			"Warrior", 
			"Black",
			agentSizeInPixelsStandard,
			30, //integrityMax,
			0, //energyMax,
			new Range(1, 10), // initiativeRange
			//actionDefns
			[
				actionDefnsCommon["Attack"],
				actionDefnsCommon["Item"],
				actionDefnsCommon["Wait"],
			],
			null // spellDefns
		),

		new AgentDefn
		(
			"Ogre", 
			"Black",
			new Coords(40, 40),
			50, //integrityMax,
			0, //energyMax,
			new Range(1, 10), // initiativeRange
			//actionDefns
			[
				actionDefnsCommon["Attack"],
			],
			null // spellDefns
		),	
	];

	agentDefns.addLookups("name");

	var encounterDefns = 
	[
		new EncounterDefn
		(
			"Default",
			// panes
			[//coords... x and y?
				new Pane("Field_Other", new Coords(00, 00), new Coords(225, 150)),
				new Pane("Field_Player", new Coords(225, 0), new Coords(75, 150)),
				new Pane("Status_Other", new Coords(0, 150), new Coords(100, 75)),
				new Pane("Status_Player", new Coords(100, 150), new Coords(125, 75)),
				new Pane("Menu_Player", new Coords(225, 150), new Coords(75, 75)),				
			]
		),
	];

	encounterDefns.addLookups("name");

	var encounter = new Encounter
	(
		encounterDefns["Default"].name,
		// parties
		[
			new Party
			(
				"Player",
				new IntelligenceHuman(),
				[
					new Agent
					(
						"One",
						agentDefns["Mage"].name,
						new Coords(256, 20), 
						// itemsEquipped
						[
							new Item(itemDefns["Dagger"].name)
						],
						// itemsInInventory
						[
							new Item(itemDefns["Energy Potion"].name),
							new Item(itemDefns["Energy Potion"].name),
							new Item(itemDefns["Energy Potion"].name),
						] 
					),
					new Agent
					(
						"Two",
						agentDefns["Priest"].name,
						new Coords(256, 50),
						// itemsEquipped
						[
							new Item(itemDefns["Mace"].name)
						],
						[
							new Item(itemDefns["Heal Potion"].name),
							new Item(itemDefns["Heal Potion"].name),
							new Item(itemDefns["Heal Potion"].name),
						] // itemsInInventory
					),
					new Agent
					(
						"Three",
						agentDefns["Warrior"].name,
						new Coords(256, 80),
						// itemsEquipped
						[
							new Item(itemDefns["Sword"].name)
						],
						[] // itemsInInventory
					),
					new Agent
					(
						"Four",
						agentDefns["Mage"].name,
						new Coords(256, 110),
						// itemsEquipped
						[
							new Item(itemDefns["Dagger"].name)
						],
						[] // itemsInInventory
					),
				]
			),
			new Party
			(
				"Other",
				new IntelligenceHuman(),
				[
					new Agent
					(
						"Waka", // name
						agentDefns["Ogre"].name,
						new Coords(90, 20),
						null, // itemsEquipped
						null // itemsInInventory
					),
					new Agent
					(
						null, // name
						agentDefns["Ogre"].name,
						new Coords(30, 50),
						null, // itemsEquipped
						null // itemsInInventory
					),
					new Agent
					(
						null, // name
						agentDefns["Ogre"].name,
						new Coords(90, 80),
						null, // itemsEquipped
						null // itemsInInventory
					),
					new Agent
					(
						null, // name
						agentDefns["Ogre"].name,
						new Coords(150, 50),
						null, // itemsEquipped
						null // itemsInInventory
					),
				]
			),
		]	
	);

	var universe = new Universe
	(
		"Universe0",
		actionDefnsCommon,
		agentDefns, 
		effectDefns,
		encounterDefns, 
		itemDefns,
		encounter
	);

	Globals.Instance.initialize
	(
		100, // millisecondsPerTimerTick
		new Coords(300, 225), // viewSizeInPixels
		universe
	);
}

// extensions

Array.prototype.addLookups = function(keyName)
{
	for (var i = 0; i < this.length; i++)
	{
		var item = this[i];
		this[item[keyName]] = item;
	}
}

// classes

function Action()
{
	this.status = ActionStatus.Instances.None;
	this.parameters = [];
}
{
	// instance methods

	Action.prototype.defn = function(agent)
	{
		var returnValue = agent.defn().actionDefns[this.defnName];

		if (returnValue == null)
		{
			returnValue = Globals.Instance.universe.actionDefns[this.defnName];
		}

		return returnValue;
	}

	Action.prototype.target = function()
	{
		return this.parameters["Target"];
	}

	Action.prototype.target_Set = function(valueToSet)
	{
		this.parameters["Target"] = valueToSet;
	}

	Action.prototype.updateEncounterAndAgentForTimerTick = function(encounter, agent)
	{
		var displayHelper = Globals.Instance.displayHelper;

		if (this.status == ActionStatus.Instances.None)
		{
			this.status = ActionStatus.Instances.AwaitingActionDefn;

			var actionDefns = agent.defn().actionDefns;

			var updateEncounter = function()
			{
				var encounter = Globals.Instance.universe.encounter;
				var agent = encounter.agentCurrent;
				var action = agent.action;
				action.defnName = this.text; // hack
				var actionDefn = action.defn(agent);
				if (actionDefn.requiresTarget == true)
				{
					actionStatusNext = ActionStatus.Instances.AwaitingTarget;
				}
				else
				{
					actionStatusNext = ActionStatus.Instances.Complete;
				}
				action.status = actionStatusNext;
			}

			var panes = encounter.defn().panes;

			var menuForActionDefns = new Menu
			(
				"Actions",
				panes["Menu_Player"].pos, // pos
				new Coords(0, 8), // spacing
				null, // updateEncounter
				null, // menuable
				Menu.menuablesToMenus
				(
					actionDefns,
					[ "name" ], // bindingPathsForMenuText
					updateEncounter
				),
				0 // indexOfChildSelected
			);

			encounter.entitiesToSpawn.push(menuForActionDefns);
		}
		else if (this.status == ActionStatus.Instances.AwaitingActionDefn)
		{
			// do nothing	
		}
		else if (this.status == ActionStatus.Instances.AwaitingTarget)
		{
			var intelligence = encounter.partyCurrent().intelligence;
			intelligence.decideAction(this);
		}
		else if (this.status == ActionStatus.Instances.Running)
		{
			var actionDefn = this.defn(agent);
			actionDefn.perform(encounter, agent, this);
		}
		else if (this.status == ActionStatus.Instances.Complete)
		{
			encounter.entitiesToRemove.push(agent.action);
			agent.action = null;
			agent.hasMovedThisTurn = true;
			encounter.agentCurrentAdvance();
		}
	}
}

function ActionDefn
(
	name,
	requiresTarget, 
	perform,
	toMenu
)
{
	this.name = name;
	this.requiresTarget = requiresTarget;
	this.perform = perform;
	this.toMenu = toMenu;
}

function ActionStatus(name)
{
	this.name = name;
}
{
	ActionStatus.Instances = new ActionStatus_Instances();
	
	function ActionStatus_Instances()
	{
		this.None 		= new ActionStatus("None");
		this.AwaitingActionDefn = new ActionStatus("AwaitingActionDefn");
		this.AwaitingTarget 	= new ActionStatus("AwaitingTarget");
		this.Running 		= new ActionStatus("Running");
		this.Complete 		= new ActionStatus("Complete"); 
	}
}

function Agent(name, defnName, pos, itemsEquipped, itemsInInventory)
{
	this.name = name;
	this.defnName = defnName;
	this.pos = pos;
	this.itemsEquipped = itemsEquipped;
	this.itemsInInventory = itemsInInventory;

	this.action = null;
	this.effects = [];

	this.hasMovedThisTurn = false;
}
{
	Agent.prototype.defn = function()
	{
		return Globals.Instance.universe.agentDefns[this.defnName];
	}

	Agent.prototype.drawToDisplayHelper = function(displayHelper)
	{
		displayHelper.drawAgent(this);
	}

	Agent.prototype.initializeForEncounter = function(encounter)
	{
		var defn = this.defn();
		this.integrity = defn.integrityMax;
		this.energy = defn.energyMax;
		this.hasMovedThisTurn = false;

		if (this.itemsEquipped != null)
		{
			for (var i = 0; i < this.itemsEquipped.length; i++)
			{
				var item = this.itemsEquipped[i];
				var itemDefn = item.defn();
				var categoryNames = itemDefn.categoryNames;
				for (var c = 0; c < categoryNames.length; c++)
				{
					var categoryName = categoryNames[c];
					this.itemsEquipped[categoryName] = item;
				}
			}
		}
	}

	Agent.prototype.updateEncounterForTimerTick = function(encounter)
	{
		if (encounter.agentCurrent == this)
		{
			if (this.action == null)
			{
				this.action = new Action();
			}
	
			this.action.updateEncounterAndAgentForTimerTick
			(
				encounter,
				this
			);
		}
	}

	// menuable

	Agent.prototype.toMenu = function()
	{
		var universe = Globals.Instance.universe;
		var encounter = universe.encounter;
		var panes = encounter.defn().panes;
		var agentDefn = this.defn();
		var spellDefns = agentDefn.spellDefns;

		var textForAgent;
		if (this.name == null) // hack
		{
			textForAgent = agentDefn.name;
		}
		else
		{
			textForAgent = this.name;
		}

		textForAgent += 
			" ("
			+ "H:" + this.integrity + "/" + agentDefn.integrityMax;

		if (agentDefn.energyMax > 0)
		{
			textForAgent += 
				" E:" + this.energy + "/" + agentDefn.energyMax
		}

		textForAgent += ")";

		var returnMenu = new Menu
		(
			textForAgent,
			panes["Menu_Player"].pos, // pos
			new Coords(0, 8), // spacing
			this, // menuable
			null, // updateEncounter
			null, // children
			0 // indexOfChildSelected
		);

		return returnMenu;
	}
}

function AgentDefn
(
	name, 
	color,
	sizeInPixels, 
	integrityMax,
	energyMax,
	initiativeRange,
	actionDefns,
	spellDefns
)
{
	this.name = name;
	this.color = color;
	this.sizeInPixels = sizeInPixels;
	this.integrityMax = integrityMax;
	this.energyMax = energyMax;
	this.initiativeRange = initiativeRange;
	this.actionDefns = actionDefns;
	this.spellDefns = spellDefns;
	
	this.actionDefns.addLookups("name");

	if (this.spellDefns != null)
	{
		this.spellDefns.addLookups("name");
	}
}

function Category(name)
{
	this.name = name;
}

function Coords(x, y)
{
	this.x = x;
	this.y = y;
}
{
	Coords.prototype.add = function(other)
	{
		this.x += other.x;
		this.y += other.y;

		return this;
	}

	Coords.prototype.clone = function()
	{
		return new Coords(this.x, this.y);
	}

	Coords.prototype.divideScalar = function(scalar)
	{
		this.x /= scalar;
		this.y /= scalar;

		return this;
	}

	Coords.prototype.magnitude = function()
	{
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}

	Coords.prototype.multiplyScalar = function(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;

		return this;
	}

	Coords.prototype.overwriteWith = function(other)
	{
		this.x = other.x;
		this.y = other.y;

		return this;
	}

	Coords.prototype.subtract = function(other)
	{
		this.x -= other.x;
		this.y -= other.y;

		return this;
	}
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

function Effect(defnName)
{
	this.defnName = defnName;
	this.turnApplied = turnApplied;
}
{
	Effect.prototype.defn = function()
	{
		return Globals.Instance.universe.effectDefns[this.defnName];
	}
}

function EffectDefn(name, apply)
{
	this.name = name;
	this.apply = apply;
}

function Empty(pos)
{
	this.pos = pos;
}

function Encounter(defnName, parties)
{
	this.defnName = defnName;
	this.parties = parties;

	this.entities = [];
	this.entitiesToSpawn = [];
	this.entitiesToRemove = [];

	this.entitiesToSpawn = this.entitiesToSpawn.concat(this.parties);

	this.agentCurrent = null;
}
{
	Encounter.prototype.agentCurrentAdvance = function()
	{
		var agentNext = null;
		
		for (var i = 0; i < this.agentsAll.length; i++)
		{
			var agent = this.agentsAll[i];
			if (agent.hasMovedThisTurn == false)
			{
				agentNext = agent;
				haveAllAgentsMovedThisTurn = false;
				break;
			}
		}

		if (haveAllAgentsMovedThisTurn == true)
		{
			for (var i = 0; i < this.agentsAll.length; i++)
			{
				var agent = this.agentsAll[i];
				agent.hasMovedThisTurn = false;
			}
			agentNext = this.agentsAll[0];
		}

		this.agentCurrent = agentNext;
	}

	Encounter.prototype.defn = function()
	{
		return Globals.Instance.universe.encounterDefns[this.defnName];
	}

	Encounter.prototype.initialize = function()
	{
		this.agentsAll = [];

		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgents = party.agents;

			this.agentsAll = this.agentsAll.concat(partyAgents);
		}

		this.agentCurrentAdvance();
	}

	Encounter.prototype.partyCurrent = function()
	{
		return (this.agentCurrent.party);
	}

	Encounter.prototype.updateForTimerTick = function()
	{
		for (var i = 0; i < this.entitiesToSpawn.length; i++)
		{
			var entity = this.entitiesToSpawn[i];
			if (entity.initializeForEncounter != null)
			{
				entity.initializeForEncounter(this);
			}
			this.entities.push(entity);
		}

		this.entitiesToSpawn.length = 0;

		for (var i = 0; i < this.entities.length; i++)
		{
			var entity = this.entities[i];
			entity.updateEncounterForTimerTick(this);
		}

		for (var i = 0; i < this.entitiesToRemove.length; i++)
		{
			var entity = this.entitiesToRemove[i];
			this.entities.splice
			(
				this.entities.indexOf(entity),
				1
			);
		}

		this.entitiesToRemove.length = 0;

		this.updateForTimerTick_WinOrLose();

		Globals.Instance.displayHelper.drawEncounter(this);
	}

	Encounter.prototype.updateForTimerTick_WinOrLose = function()
	{
		for (var p = 0; p < this.parties.length; p++)
		{
			var party = this.parties[p];
			var partyAgents = party.agents;

			var areAnyAgentsInPartyAlive = false;

			for (var a = 0; a < partyAgents.length; a++)
			{
				var agent = partyAgents[a];

				if (agent.integrity > 0)
				{
					areAnyAgentsInPartyAlive = true;
					break;
				}
			}

			if (areAnyAgentsInPartyAlive == false)
			{
				if (p == 0)
				{
					document.write("You lose!");
				}
				else
				{
					document.write("You win!");
				}
			}
		}
	}
}

function EncounterDefn(name, panes)
{
	this.name = name;
	this.panes = panes;

	this.panes.addLookups("name");
}


function Globals()
{}
{
	Globals.Instance = new Globals();

	Globals.prototype.handleEventTimerTick = function()
	{
		this.universe.updateForTimerTick();
		this.inputHelper.updateForTimerTick();
	}

	Globals.prototype.initialize = function
	(
		millisecondsPerTimerTick,
		viewSizeInPixels,
		universe
	)
	{
		this.displayHelper = new DisplayHelper();
		this.displayHelper.initialize(viewSizeInPixels);

		this.universe = universe;
		this.universe.initialize();

		this.inputHelper = new InputHelper();
		this.inputHelper.initialize();

		this.timer = setInterval
		(
			this.handleEventTimerTick.bind(this),
			millisecondsPerTimerTick
		);
	}
}

function InputHelper()
{}
{
	InputHelper.prototype.initialize = function()
	{
		document.body.onkeydown = this.handleEventKeyDown.bind(this);
		document.body.onkeyup = this.handleEventKeyUp.bind(this);
	}

	InputHelper.prototype.updateForTimerTick = function()
	{
		this.keyCodePressed = null;
	}

	// events

	InputHelper.prototype.handleEventKeyDown = function(e)
	{
		this.keyCodePressed = e.keyCode;
	}

	InputHelper.prototype.handleEventKeyUp = function(e)
	{
		// todo 
	}
}

function IntelligenceHuman()
{}
{
	IntelligenceHuman.prototype.decideAction = function(action)
	{
		var encounter = Globals.Instance.universe.encounter;
		var agent = encounter.agentCurrent;

		var target = action.target();
		if (target == null)
		{
			target = encounter.parties[1].agents[0];
			action.target_Set(target);
			action.parameters["EmptyForPosToReturnTo"] = new Empty(agent.pos.clone());
		}

		var inputHelper = Globals.Instance.inputHelper;
		var keyCodePressed = inputHelper.keyCodePressed;
	
		if (keyCodePressed == 13)
		{
			action.status = ActionStatus.Instances.Running;
		}
		else
		{
			var partyTargeted = target.party;
			var agentsInPartyTargeted = partyTargeted.agents;

			if (keyCodePressed == 65) // a
			{
				partyToTarget = encounter.parties[1];
				if (partyToTarget != partyTargeted)
				{
					target = partyToTarget.agents[0];
				}
			}
			else if (keyCodePressed == 68) // d
			{
				partyToTarget = encounter.parties[0];
				if (partyToTarget != partyTargeted)
				{
					target = partyToTarget.agents[0];
				}
			}
			else if (keyCodePressed == 83) // s
			{
				var indexOfAgentToTarget = agentsInPartyTargeted.indexOf(target) + 1;
				if (indexOfAgentToTarget >= agentsInPartyTargeted.length)
				{
					indexOfAgentToTarget = 0;
				}
				target = agentsInPartyTargeted[indexOfAgentToTarget];
			}
			else if (keyCodePressed == 87) // w
			{		
				var indexOfAgentToTarget = agentsInPartyTargeted.indexOf(target) - 1;
				if (indexOfAgentTargeted < 0)
				{
					indexOfAgentToTarget = agentsInPartyTargeted.length - 1;
				}
				target = agentsInPartyTargeted[indexOfAgentToTarget];
			}

			action.target_Set
			(
				target
			);
		}
	}
}

function IntelligenceMachine()
{}
{
	IntelligenceMachine.prototype.decideAction = function()
	{
		// todo
	}
}

function Item(defnName)
{
	this.defnName = defnName;
}
{
	Item.prototype.apply = function(agent, target)
	{
		this.defn().apply(this, agent, target);
	}

	Item.prototype.defn = function()
	{
		return Globals.Instance.universe.itemDefns[this.defnName];
	}
}

function ItemDefn(name, categoryNames, apply)
{
	this.name = name;
	this.categoryNames = categoryNames;
	this.apply = apply;
}

function Menu
(
	text, 
	pos, 
	spacing, 
	menuable,
	updateEncounter, 
	children, 
	indexOfChildSelected
)
{
	this.text = text;
	this.pos = pos;
	this.spacing = spacing;
	this.menuable = menuable;
	this.updateEncounter = updateEncounter;
	this.children = children;
	this.indexOfChildSelected = indexOfChildSelected;
}
{
	Menu.menuablesToMenus = function(menuables, bindingPathsForMenuText, updateEncounter)
	{
		var returnValues = [];

		for (var i = 0; i < menuables.length; i++)
		{
			var menuable = menuables[i];

			var menuableAsMenu;

			if (menuable.toMenu != null)
			{
				menuableAsMenu = menuable.toMenu();
			}
			else
			{
				var menuText = "";
				for (var f = 0; f < bindingPathsForMenuText.length; f++)
				{
					var bindingPathForMenuText = bindingPathsForMenuText[f];
					var bindingPathElements = bindingPathForMenuText.split(".");
	
					var valueCurrent = menuable;
					for (var g = 0; g < bindingPathElements.length; g++)
					{
						var bindingPathElement = bindingPathElements[g];
	
						if (bindingPathElement.indexOf("()") == -1)
						{
							valueCurrent = valueCurrent[bindingPathElement];
						}
						else
						{
							bindingPathElement = bindingPathElement.substr(0, bindingPathElement.length - "()".length);
							var method = valueCurrent[bindingPathElement];
							valueCurrent = method.call(valueCurrent);
						}
					}
	
					menuText += valueCurrent;
				}
	
				menuableAsMenu = new Menu
				(
					menuText,
					new Coords(0, 0), // pos
					new Coords(0, 8), // spacing
					menuable, // menuable
					updateEncounter,
					null // children
				);
			}
			
			

			returnValues.push(menuableAsMenu);
		}

		return returnValues;
	}

	// instance methods

	Menu.prototype.childSelected = function()
	{
		return (this.indexOfChildSelected == null ? null : this.children[this.indexOfChildSelected]);
	}

	Menu.prototype.drawToDisplayHelper = function(displayHelper)
	{
		displayHelper.drawMenu(this);
	}

	Menu.prototype.indexOfChildSelectedAdd = function(valueToAdd)
	{
		this.indexOfChildSelected += valueToAdd;
		if (this.indexOfChildSelected < 0)
		{
			this.indexOfChildSelected = this.children.length - 1;
		}
		else if (this.indexOfChildSelected >= this.children.length)
		{
			this.indexOfChildSelected = 0;
		}
	}

	Menu.prototype.updateEncounterForTimerTick = function(encounter)
	{
		if (this.isLocked == true)
		{
			return;
		}

		var inputHelper = Globals.Instance.inputHelper;
		var keyCodePressed = inputHelper.keyCodePressed;

		if (keyCodePressed == 65) // a
		{
			// todo - back
		}
		else if (keyCodePressed == 13 || keyCodePressed == 68) // d
		{
			var encounter = Globals.Instance.universe.encounter;
			var childSelected = this.childSelected();

			this.isLocked = true;

			if (childSelected.children == null)
			{
				childSelected.updateEncounter(encounter);
			}
			else
			{
				encounter.entitiesToRemove.push(this);
				encounter.entitiesToSpawn.push(childSelected);
			}
		}
		else if (keyCodePressed == 83) // s
		{
			this.indexOfChildSelectedAdd(1);
		}
		else if (keyCodePressed == 87) // w
		{
			this.indexOfChildSelectedAdd(-1);
		}
	}
}

function Message(text, pos)
{
	this.text = text;
	this.pos = pos;

	this.ticksToLive = 100;
}

function NumberHelper()
{
	// static class
}
{
	NumberHelper.trimValueToMinAndMax = function(value, min, max)
	{
		if (value < min)
		{
			value = min;
		}
		else if (value > max)
		{
			value = max;
		}

		return value;
	}
}

function Pane(name, pos, size)
{
	this.name = name;
	this.pos = pos;
	this.size = size;
}

function Party(name, intelligence, agents)
{
	this.name = name;
	this.intelligence = intelligence;
	this.agents = agents;

	this.agentIndexCurrent = null;

	for (var i = 0; i < this.agents.length; i++)
	{
		var agent = this.agents[i];
		agent.party = this;
	}
}
{
	Party.prototype.agentCurrent = function()
 	{
		return (this.agentIndexCurrent == null ? null : this.agents[this.agentIndexCurrent]);
	}

	Party.prototype.agentCurrentAdvance = function()
	{
		if (this.agentIndexCurrent == null)
		{
			this.agentIndexCurrent = 0;
		}
		else
		{
			this.agentIndexCurrent++;
			if (this.agentIndexCurrent >= this.agents.length)
			{
				this.agentIndexCurrent = 0;
			}
		}
	}

	Party.prototype.drawToDisplayHelper = function(displayHelper)
	{
		var panes = Globals.Instance.universe.encounter.defn().panes;

		var paneToDrawPartyStatusIn = panes["Status_" + this.name];
		displayHelper.drawPartyWithStatusPane(this, paneToDrawPartyStatusIn);		
	}

	Party.prototype.initializeForEncounter = function(encounter)
	{
		for (var i = 0; i < this.agents.length; i++)
		{
			var agent = this.agents[i];
			encounter.entitiesToSpawn.push(agent);
		}
	}

	Party.prototype.updateEncounterForTimerTick = function(encounter)
	{
		// do nothing
	}
}

function Range(min, max)
{
	this.min = min;
	this.max = max;
	this.size = this.max - this.min;
}
{
	Range.prototype.randomNumberInRange = function()
	{
		return
			this.min 
			+ Math.floor
			(
				Math.random()
				* this.size
			);
	}
}

function SpellDefn(name, apply)
{
	this.name = name;
	this.apply = apply;
}

function Universe
(
	name, 
	actionDefns,
	agentDefns, 
	effectDefns, 
	encounterDefns, 
	itemDefns,
	encounter
)
{
	this.name = name;
	this.actionDefns = actionDefns;
	this.agentDefns = agentDefns;
	this.effectDefns = effectDefns;
	this.encounterDefns = encounterDefns;
	this.itemDefns = itemDefns;
	this.encounter = encounter;

	this.agentDefns.addLookups("name");
	this.effectDefns.addLookups("name");
	this.encounterDefns.addLookups("name");
	this.itemDefns.addLookups("name");
}
{
	Universe.prototype.initialize = function()
	{
		this.encounter.initialize();
	}

	Universe.prototype.updateForTimerTick = function()
	{
		this.encounter.updateForTimerTick();
	}
}

// run

main();
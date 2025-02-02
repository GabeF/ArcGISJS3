// This file was generated by Mendix Modeler.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package myfirstmodule.proxies;

public class Root
{
	private final com.mendix.systemwideinterfaces.core.IMendixObject rootMendixObject;

	private final com.mendix.systemwideinterfaces.core.IContext context;

	/**
	 * Internal name of this entity
	 */
	public static final java.lang.String entityName = "MyFirstModule.Root";

	/**
	 * Enum describing members of this entity
	 */
	public enum MemberNames
	{
		Objectid("Objectid"),
		Create_user_name("Create_user_name"),
		Create_date("Create_date"),
		Effective_date("Effective_date"),
		Expiry_date("Expiry_date"),
		Lifecycle_status_key("Lifecycle_status_key"),
		Lifecycle_status("Lifecycle_status"),
		Asset_type_key("Asset_type_key"),
		Asset_type("Asset_type"),
		Asset_sub_type_key("Asset_sub_type_key"),
		Asset_sub_type("Asset_sub_type"),
		Site_identifier("Site_identifier"),
		Label("Label"),
		Create_date_local_tz_key("Create_date_local_tz_key"),
		Create_date_local_tz("Create_date_local_tz"),
		Globalid("Globalid");

		private java.lang.String metaName;

		MemberNames(java.lang.String s)
		{
			metaName = s;
		}

		@java.lang.Override
		public java.lang.String toString()
		{
			return metaName;
		}
	}

	public Root(com.mendix.systemwideinterfaces.core.IContext context)
	{
		this(context, com.mendix.core.Core.instantiate(context, "MyFirstModule.Root"));
	}

	protected Root(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject rootMendixObject)
	{
		if (rootMendixObject == null)
			throw new java.lang.IllegalArgumentException("The given object cannot be null.");
		if (!com.mendix.core.Core.isSubClassOf("MyFirstModule.Root", rootMendixObject.getType()))
			throw new java.lang.IllegalArgumentException("The given object is not a MyFirstModule.Root");

		this.rootMendixObject = rootMendixObject;
		this.context = context;
	}

	/**
	 * @deprecated Use 'Root.load(IContext, IMendixIdentifier)' instead.
	 */
	@java.lang.Deprecated
	public static myfirstmodule.proxies.Root initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		return myfirstmodule.proxies.Root.load(context, mendixIdentifier);
	}

	/**
	 * Initialize a proxy using context (recommended). This context will be used for security checking when the get- and set-methods without context parameters are called.
	 * The get- and set-methods with context parameter should be used when for instance sudo access is necessary (IContext.createSudoClone() can be used to obtain sudo access).
	 */
	public static myfirstmodule.proxies.Root initialize(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixObject mendixObject)
	{
		return new myfirstmodule.proxies.Root(context, mendixObject);
	}

	public static myfirstmodule.proxies.Root load(com.mendix.systemwideinterfaces.core.IContext context, com.mendix.systemwideinterfaces.core.IMendixIdentifier mendixIdentifier) throws com.mendix.core.CoreException
	{
		com.mendix.systemwideinterfaces.core.IMendixObject mendixObject = com.mendix.core.Core.retrieveId(context, mendixIdentifier);
		return myfirstmodule.proxies.Root.initialize(context, mendixObject);
	}

	/**
	 * Commit the changes made on this proxy object.
	 */
	public final void commit() throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Commit the changes made on this proxy object using the specified context.
	 */
	public final void commit(com.mendix.systemwideinterfaces.core.IContext context) throws com.mendix.core.CoreException
	{
		com.mendix.core.Core.commit(context, getMendixObject());
	}

	/**
	 * Delete the object.
	 */
	public final void delete()
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}

	/**
	 * Delete the object using the specified context.
	 */
	public final void delete(com.mendix.systemwideinterfaces.core.IContext context)
	{
		com.mendix.core.Core.delete(context, getMendixObject());
	}
	/**
	 * @return value of Objectid
	 */
	public final java.lang.Integer getObjectid()
	{
		return getObjectid(getContext());
	}

	/**
	 * @param context
	 * @return value of Objectid
	 */
	public final java.lang.Integer getObjectid(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Integer) getMendixObject().getValue(context, MemberNames.Objectid.toString());
	}

	/**
	 * Set value of Objectid
	 * @param objectid
	 */
	public final void setObjectid(java.lang.Integer objectid)
	{
		setObjectid(getContext(), objectid);
	}

	/**
	 * Set value of Objectid
	 * @param context
	 * @param objectid
	 */
	public final void setObjectid(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Integer objectid)
	{
		getMendixObject().setValue(context, MemberNames.Objectid.toString(), objectid);
	}

	/**
	 * @return value of Create_user_name
	 */
	public final java.lang.String getCreate_user_name()
	{
		return getCreate_user_name(getContext());
	}

	/**
	 * @param context
	 * @return value of Create_user_name
	 */
	public final java.lang.String getCreate_user_name(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Create_user_name.toString());
	}

	/**
	 * Set value of Create_user_name
	 * @param create_user_name
	 */
	public final void setCreate_user_name(java.lang.String create_user_name)
	{
		setCreate_user_name(getContext(), create_user_name);
	}

	/**
	 * Set value of Create_user_name
	 * @param context
	 * @param create_user_name
	 */
	public final void setCreate_user_name(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String create_user_name)
	{
		getMendixObject().setValue(context, MemberNames.Create_user_name.toString(), create_user_name);
	}

	/**
	 * @return value of Create_date
	 */
	public final java.lang.Long getCreate_date()
	{
		return getCreate_date(getContext());
	}

	/**
	 * @param context
	 * @return value of Create_date
	 */
	public final java.lang.Long getCreate_date(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.Create_date.toString());
	}

	/**
	 * Set value of Create_date
	 * @param create_date
	 */
	public final void setCreate_date(java.lang.Long create_date)
	{
		setCreate_date(getContext(), create_date);
	}

	/**
	 * Set value of Create_date
	 * @param context
	 * @param create_date
	 */
	public final void setCreate_date(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long create_date)
	{
		getMendixObject().setValue(context, MemberNames.Create_date.toString(), create_date);
	}

	/**
	 * @return value of Effective_date
	 */
	public final java.lang.Long getEffective_date()
	{
		return getEffective_date(getContext());
	}

	/**
	 * @param context
	 * @return value of Effective_date
	 */
	public final java.lang.Long getEffective_date(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.Effective_date.toString());
	}

	/**
	 * Set value of Effective_date
	 * @param effective_date
	 */
	public final void setEffective_date(java.lang.Long effective_date)
	{
		setEffective_date(getContext(), effective_date);
	}

	/**
	 * Set value of Effective_date
	 * @param context
	 * @param effective_date
	 */
	public final void setEffective_date(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long effective_date)
	{
		getMendixObject().setValue(context, MemberNames.Effective_date.toString(), effective_date);
	}

	/**
	 * @return value of Expiry_date
	 */
	public final java.lang.Long getExpiry_date()
	{
		return getExpiry_date(getContext());
	}

	/**
	 * @param context
	 * @return value of Expiry_date
	 */
	public final java.lang.Long getExpiry_date(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.Long) getMendixObject().getValue(context, MemberNames.Expiry_date.toString());
	}

	/**
	 * Set value of Expiry_date
	 * @param expiry_date
	 */
	public final void setExpiry_date(java.lang.Long expiry_date)
	{
		setExpiry_date(getContext(), expiry_date);
	}

	/**
	 * Set value of Expiry_date
	 * @param context
	 * @param expiry_date
	 */
	public final void setExpiry_date(com.mendix.systemwideinterfaces.core.IContext context, java.lang.Long expiry_date)
	{
		getMendixObject().setValue(context, MemberNames.Expiry_date.toString(), expiry_date);
	}

	/**
	 * @return value of Lifecycle_status_key
	 */
	public final java.lang.String getLifecycle_status_key()
	{
		return getLifecycle_status_key(getContext());
	}

	/**
	 * @param context
	 * @return value of Lifecycle_status_key
	 */
	public final java.lang.String getLifecycle_status_key(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Lifecycle_status_key.toString());
	}

	/**
	 * Set value of Lifecycle_status_key
	 * @param lifecycle_status_key
	 */
	public final void setLifecycle_status_key(java.lang.String lifecycle_status_key)
	{
		setLifecycle_status_key(getContext(), lifecycle_status_key);
	}

	/**
	 * Set value of Lifecycle_status_key
	 * @param context
	 * @param lifecycle_status_key
	 */
	public final void setLifecycle_status_key(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String lifecycle_status_key)
	{
		getMendixObject().setValue(context, MemberNames.Lifecycle_status_key.toString(), lifecycle_status_key);
	}

	/**
	 * @return value of Lifecycle_status
	 */
	public final java.lang.String getLifecycle_status()
	{
		return getLifecycle_status(getContext());
	}

	/**
	 * @param context
	 * @return value of Lifecycle_status
	 */
	public final java.lang.String getLifecycle_status(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Lifecycle_status.toString());
	}

	/**
	 * Set value of Lifecycle_status
	 * @param lifecycle_status
	 */
	public final void setLifecycle_status(java.lang.String lifecycle_status)
	{
		setLifecycle_status(getContext(), lifecycle_status);
	}

	/**
	 * Set value of Lifecycle_status
	 * @param context
	 * @param lifecycle_status
	 */
	public final void setLifecycle_status(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String lifecycle_status)
	{
		getMendixObject().setValue(context, MemberNames.Lifecycle_status.toString(), lifecycle_status);
	}

	/**
	 * @return value of Asset_type_key
	 */
	public final java.lang.String getAsset_type_key()
	{
		return getAsset_type_key(getContext());
	}

	/**
	 * @param context
	 * @return value of Asset_type_key
	 */
	public final java.lang.String getAsset_type_key(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Asset_type_key.toString());
	}

	/**
	 * Set value of Asset_type_key
	 * @param asset_type_key
	 */
	public final void setAsset_type_key(java.lang.String asset_type_key)
	{
		setAsset_type_key(getContext(), asset_type_key);
	}

	/**
	 * Set value of Asset_type_key
	 * @param context
	 * @param asset_type_key
	 */
	public final void setAsset_type_key(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String asset_type_key)
	{
		getMendixObject().setValue(context, MemberNames.Asset_type_key.toString(), asset_type_key);
	}

	/**
	 * @return value of Asset_type
	 */
	public final java.lang.String getAsset_type()
	{
		return getAsset_type(getContext());
	}

	/**
	 * @param context
	 * @return value of Asset_type
	 */
	public final java.lang.String getAsset_type(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Asset_type.toString());
	}

	/**
	 * Set value of Asset_type
	 * @param asset_type
	 */
	public final void setAsset_type(java.lang.String asset_type)
	{
		setAsset_type(getContext(), asset_type);
	}

	/**
	 * Set value of Asset_type
	 * @param context
	 * @param asset_type
	 */
	public final void setAsset_type(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String asset_type)
	{
		getMendixObject().setValue(context, MemberNames.Asset_type.toString(), asset_type);
	}

	/**
	 * @return value of Asset_sub_type_key
	 */
	public final java.lang.String getAsset_sub_type_key()
	{
		return getAsset_sub_type_key(getContext());
	}

	/**
	 * @param context
	 * @return value of Asset_sub_type_key
	 */
	public final java.lang.String getAsset_sub_type_key(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Asset_sub_type_key.toString());
	}

	/**
	 * Set value of Asset_sub_type_key
	 * @param asset_sub_type_key
	 */
	public final void setAsset_sub_type_key(java.lang.String asset_sub_type_key)
	{
		setAsset_sub_type_key(getContext(), asset_sub_type_key);
	}

	/**
	 * Set value of Asset_sub_type_key
	 * @param context
	 * @param asset_sub_type_key
	 */
	public final void setAsset_sub_type_key(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String asset_sub_type_key)
	{
		getMendixObject().setValue(context, MemberNames.Asset_sub_type_key.toString(), asset_sub_type_key);
	}

	/**
	 * @return value of Asset_sub_type
	 */
	public final java.lang.String getAsset_sub_type()
	{
		return getAsset_sub_type(getContext());
	}

	/**
	 * @param context
	 * @return value of Asset_sub_type
	 */
	public final java.lang.String getAsset_sub_type(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Asset_sub_type.toString());
	}

	/**
	 * Set value of Asset_sub_type
	 * @param asset_sub_type
	 */
	public final void setAsset_sub_type(java.lang.String asset_sub_type)
	{
		setAsset_sub_type(getContext(), asset_sub_type);
	}

	/**
	 * Set value of Asset_sub_type
	 * @param context
	 * @param asset_sub_type
	 */
	public final void setAsset_sub_type(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String asset_sub_type)
	{
		getMendixObject().setValue(context, MemberNames.Asset_sub_type.toString(), asset_sub_type);
	}

	/**
	 * @return value of Site_identifier
	 */
	public final java.lang.String getSite_identifier()
	{
		return getSite_identifier(getContext());
	}

	/**
	 * @param context
	 * @return value of Site_identifier
	 */
	public final java.lang.String getSite_identifier(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Site_identifier.toString());
	}

	/**
	 * Set value of Site_identifier
	 * @param site_identifier
	 */
	public final void setSite_identifier(java.lang.String site_identifier)
	{
		setSite_identifier(getContext(), site_identifier);
	}

	/**
	 * Set value of Site_identifier
	 * @param context
	 * @param site_identifier
	 */
	public final void setSite_identifier(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String site_identifier)
	{
		getMendixObject().setValue(context, MemberNames.Site_identifier.toString(), site_identifier);
	}

	/**
	 * @return value of Label
	 */
	public final java.lang.String getLabel()
	{
		return getLabel(getContext());
	}

	/**
	 * @param context
	 * @return value of Label
	 */
	public final java.lang.String getLabel(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Label.toString());
	}

	/**
	 * Set value of Label
	 * @param label
	 */
	public final void setLabel(java.lang.String label)
	{
		setLabel(getContext(), label);
	}

	/**
	 * Set value of Label
	 * @param context
	 * @param label
	 */
	public final void setLabel(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String label)
	{
		getMendixObject().setValue(context, MemberNames.Label.toString(), label);
	}

	/**
	 * @return value of Create_date_local_tz_key
	 */
	public final java.lang.String getCreate_date_local_tz_key()
	{
		return getCreate_date_local_tz_key(getContext());
	}

	/**
	 * @param context
	 * @return value of Create_date_local_tz_key
	 */
	public final java.lang.String getCreate_date_local_tz_key(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Create_date_local_tz_key.toString());
	}

	/**
	 * Set value of Create_date_local_tz_key
	 * @param create_date_local_tz_key
	 */
	public final void setCreate_date_local_tz_key(java.lang.String create_date_local_tz_key)
	{
		setCreate_date_local_tz_key(getContext(), create_date_local_tz_key);
	}

	/**
	 * Set value of Create_date_local_tz_key
	 * @param context
	 * @param create_date_local_tz_key
	 */
	public final void setCreate_date_local_tz_key(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String create_date_local_tz_key)
	{
		getMendixObject().setValue(context, MemberNames.Create_date_local_tz_key.toString(), create_date_local_tz_key);
	}

	/**
	 * @return value of Create_date_local_tz
	 */
	public final java.lang.String getCreate_date_local_tz()
	{
		return getCreate_date_local_tz(getContext());
	}

	/**
	 * @param context
	 * @return value of Create_date_local_tz
	 */
	public final java.lang.String getCreate_date_local_tz(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Create_date_local_tz.toString());
	}

	/**
	 * Set value of Create_date_local_tz
	 * @param create_date_local_tz
	 */
	public final void setCreate_date_local_tz(java.lang.String create_date_local_tz)
	{
		setCreate_date_local_tz(getContext(), create_date_local_tz);
	}

	/**
	 * Set value of Create_date_local_tz
	 * @param context
	 * @param create_date_local_tz
	 */
	public final void setCreate_date_local_tz(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String create_date_local_tz)
	{
		getMendixObject().setValue(context, MemberNames.Create_date_local_tz.toString(), create_date_local_tz);
	}

	/**
	 * @return value of Globalid
	 */
	public final java.lang.String getGlobalid()
	{
		return getGlobalid(getContext());
	}

	/**
	 * @param context
	 * @return value of Globalid
	 */
	public final java.lang.String getGlobalid(com.mendix.systemwideinterfaces.core.IContext context)
	{
		return (java.lang.String) getMendixObject().getValue(context, MemberNames.Globalid.toString());
	}

	/**
	 * Set value of Globalid
	 * @param globalid
	 */
	public final void setGlobalid(java.lang.String globalid)
	{
		setGlobalid(getContext(), globalid);
	}

	/**
	 * Set value of Globalid
	 * @param context
	 * @param globalid
	 */
	public final void setGlobalid(com.mendix.systemwideinterfaces.core.IContext context, java.lang.String globalid)
	{
		getMendixObject().setValue(context, MemberNames.Globalid.toString(), globalid);
	}

	/**
	 * @return the IMendixObject instance of this proxy for use in the Core interface.
	 */
	public final com.mendix.systemwideinterfaces.core.IMendixObject getMendixObject()
	{
		return rootMendixObject;
	}

	/**
	 * @return the IContext instance of this proxy, or null if no IContext instance was specified at initialization.
	 */
	public final com.mendix.systemwideinterfaces.core.IContext getContext()
	{
		return context;
	}

	@java.lang.Override
	public boolean equals(Object obj)
	{
		if (obj == this)
			return true;

		if (obj != null && getClass().equals(obj.getClass()))
		{
			final myfirstmodule.proxies.Root that = (myfirstmodule.proxies.Root) obj;
			return getMendixObject().equals(that.getMendixObject());
		}
		return false;
	}

	@java.lang.Override
	public int hashCode()
	{
		return getMendixObject().hashCode();
	}

	/**
	 * @return String name of this class
	 */
	public static java.lang.String getType()
	{
		return "MyFirstModule.Root";
	}

	/**
	 * @return String GUID from this object, format: ID_0000000000
	 * @deprecated Use getMendixObject().getId().toLong() to get a unique identifier for this object.
	 */
	@java.lang.Deprecated
	public java.lang.String getGUID()
	{
		return "ID_" + getMendixObject().getId().toLong();
	}
}

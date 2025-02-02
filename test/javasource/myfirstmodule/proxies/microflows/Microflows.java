// This file was generated by Mendix Modeler 7.23.
//
// WARNING: Code you write here will be lost the next time you deploy the project.

package myfirstmodule.proxies.microflows;

import java.util.HashMap;
import java.util.Map;
import com.mendix.core.Core;
import com.mendix.core.CoreException;
import com.mendix.systemwideinterfaces.MendixRuntimeException;
import com.mendix.systemwideinterfaces.core.IContext;
import com.mendix.systemwideinterfaces.core.IMendixObject;

public class Microflows
{
	// These are the microflows for the MyFirstModule module
	public static myfirstmodule.proxies.MapController cAR_MapController(IContext context)
	{
		try
		{
			Map<java.lang.String, Object> params = new HashMap<java.lang.String, Object>();
			IMendixObject result = (IMendixObject)Core.execute(context, "MyFirstModule.CAR_MapController", params);
			return result == null ? null : myfirstmodule.proxies.MapController.initialize(context, result);
		}
		catch (CoreException e)
		{
			throw new MendixRuntimeException(e);
		}
	}
	public static void load_Form(IContext context, myfirstmodule.proxies.MapController _mapController)
	{
		try
		{
			Map<java.lang.String, Object> params = new HashMap<java.lang.String, Object>();
			params.put("MapController", _mapController == null ? null : _mapController.getMendixObject());
			Core.execute(context, "MyFirstModule.Load_Form", params);
		}
		catch (CoreException e)
		{
			throw new MendixRuntimeException(e);
		}
	}
	public static void load_JSON_Tree(IContext context, myfirstmodule.proxies.MapController _mapController)
	{
		try
		{
			Map<java.lang.String, Object> params = new HashMap<java.lang.String, Object>();
			params.put("MapController", _mapController == null ? null : _mapController.getMendixObject());
			Core.execute(context, "MyFirstModule.Load_JSON_Tree", params);
		}
		catch (CoreException e)
		{
			throw new MendixRuntimeException(e);
		}
	}
	public static void set_ZoomTo_GlobalID(IContext context, myfirstmodule.proxies.MapController _mapController)
	{
		try
		{
			Map<java.lang.String, Object> params = new HashMap<java.lang.String, Object>();
			params.put("MapController", _mapController == null ? null : _mapController.getMendixObject());
			Core.execute(context, "MyFirstModule.Set_ZoomTo_GlobalID", params);
		}
		catch (CoreException e)
		{
			throw new MendixRuntimeException(e);
		}
	}
	public static void sET_ZoomTo_Lat_and_Lon(IContext context, myfirstmodule.proxies.MapController _mapController)
	{
		try
		{
			Map<java.lang.String, Object> params = new HashMap<java.lang.String, Object>();
			params.put("MapController", _mapController == null ? null : _mapController.getMendixObject());
			Core.execute(context, "MyFirstModule.SET_ZoomTo_Lat_and_Lon", params);
		}
		catch (CoreException e)
		{
			throw new MendixRuntimeException(e);
		}
	}
}
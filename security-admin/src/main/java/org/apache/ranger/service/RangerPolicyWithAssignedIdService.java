/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package org.apache.ranger.service;

import java.util.List;
import java.util.Map;

import org.apache.ranger.common.JSONUtil;
import org.apache.ranger.entity.XXPolicyBase;
import org.apache.ranger.entity.XXPolicyWithAssignedId;
import org.apache.ranger.plugin.model.RangerPolicy;
import org.apache.ranger.plugin.model.RangerPolicy.RangerPolicyItem;
import org.apache.ranger.plugin.model.RangerPolicy.RangerPolicyResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RangerPolicyWithAssignedIdService extends RangerPolicyServiceBase<XXPolicyWithAssignedId, RangerPolicy> {

	@Autowired
	JSONUtil jsonUtil;

	@Override
	protected XXPolicyWithAssignedId mapViewToEntityBean(RangerPolicy vObj, XXPolicyWithAssignedId xObj,
			int OPERATION_CONTEXT) {
		return (XXPolicyWithAssignedId) super.mapViewToEntityBean(vObj, (XXPolicyBase) xObj, OPERATION_CONTEXT);
	}

	@Override
	protected RangerPolicy mapEntityToViewBean(RangerPolicy vObj, XXPolicyWithAssignedId xObj) {
		return super.mapEntityToViewBean(vObj, (XXPolicyBase) xObj);
	}

	@Override
	protected void validateForCreate(RangerPolicy vObj) {
		// TODO Auto-generated method stub

	}

	@Override
	protected void validateForUpdate(RangerPolicy vObj, XXPolicyWithAssignedId entityObj) {
		// TODO Auto-generated method stub

	}

	@Override
	protected RangerPolicy populateViewBean(XXPolicyWithAssignedId xPolicy) {
		RangerPolicy vPolicy = super.populateViewBean(xPolicy);

		Map<String, RangerPolicyResource> resources = getResourcesForXXPolicy(xPolicy);
		vPolicy.setResources(resources);

		List<RangerPolicyItem> policyItems = getPolicyItemListForXXPolicy(xPolicy);
		vPolicy.setPolicyItems(policyItems);

		return vPolicy;
	}

	public RangerPolicy getPopulatedViewObject(XXPolicyWithAssignedId xPolicy) {
		return this.populateViewBean(xPolicy);
	}

}

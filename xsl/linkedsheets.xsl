<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:output method="html" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" encoding="UTF-8" />

	<xsl:param name="input" />

	<xsl:variable name="smallcase" select="'abcdefghijklmnopqrstuvwxyzéèëêàçö'" />
	<xsl:variable name="uppercase" select="'ABCDEFGHIJKLMNOPQRSTUVWXYZEEEEACO'" />


	<xsl:template match="/">
		<xsl:apply-templates select="*[1]" mode="heading" />
	</xsl:template>

	<!--HEADING-->
	<xsl:template match="*[1]" mode="heading">
		<!--<a href="">
			<h1>
				<xsl:value-of select="local-name(.)" />
			</h1>
		</a>-->
		<xsl:apply-templates select="*" mode="keys" />
		<!--<xsl:apply-templates select="*[1]/*[1]/attribute::*" mode="keys2" />-->
		<!--<xsl:value-of select="/*[1]/*[local-name(.) = local-name(current()/*[1]/*[1]/attribute::*)]" />-->
		<!--<xsl:value-of select="*[1]/*[1]/attribute::*[local-name(.) = local-name(/*[1]/*)]" />-->
		<xsl:apply-templates select="*[1]" mode="main" />
	</xsl:template>

	<xsl:template match="*" mode="keys">
		<p>
			<!--<xsl:value-of select="local-name()" />-->
			<xsl:if test="/*[1]/*[1]/*[1]/attribute::*[local-name(current()) = local-name(.)]">
				<label for="{local-name(.)}">
					<xsl:value-of select="local-name(.)" />
				</label>
				<input list="{local-name(.)}-list" id="{local-name(.)}" name="{local-name(.)}" />
				<datalist id="{local-name(.)}-list">
					<xsl:apply-templates select="*" mode="datalist" />
				</datalist>

			</xsl:if>
		</p>
	</xsl:template>

	<xsl:template match="*[1]/*[1]/attribute::*" mode="keys2">
		<xsl:if test="/*[1]/*[local-name(.) = local-name(current())]">
			<p>
				<label for="{local-name(.)}">
					<xsl:value-of select="local-name(.)" />
				</label>
				<input list="{local-name(.)}-list" id="{local-name(.)}" name="{local-name(.)}" />
				<datalist id="{local-name(.)}-list">
					<xsl:apply-templates select="*" mode="datalist" />
				</datalist>
			</p>
		</xsl:if>
	</xsl:template>
	<xsl:template match="*" mode="datalist">
		<option value="{attribute::*[1]}" />
	</xsl:template>
	<!--<xsl:template match="/*[1]/*" mode="keymatch">
		<xsl:value-of select="." />
	</xsl:template>-->

	<!--MAIN SHEET-->
	<xsl:template match="*[1]" mode="main">
		<table class="row-border" id="{local-name(.)}">
			<thead>
				<xsl:apply-templates select="*[1]" mode="autoheader" />
			</thead>
			<tbody>
				<xsl:choose>
					<xsl:when test="$input = ''">
						<xsl:apply-templates select="child::*" mode="autovalues" />
					</xsl:when>
					<xsl:otherwise>
						<xsl:apply-templates select="child::*[@*[contains(translate(., $smallcase, $uppercase), translate($input, $smallcase, $uppercase))] or *[contains(translate(., $smallcase, $uppercase), translate($input, $smallcase, $uppercase))]]" mode="autovalues" />
					</xsl:otherwise>
				</xsl:choose>
			</tbody>
		</table>
	</xsl:template>

	<!-- RUN THROUGHT ATTRIBUTES: make header -->
	<xsl:template match="*[1]" mode="autoheader">
		<tr>
			<xsl:apply-templates select="child::*[1]" mode="details-control-header" />

			<xsl:apply-templates select="attribute::*" mode="attributes-header">
				<xsl:sort select="position()" order="ascending" data-type="number" />
			</xsl:apply-templates>

			<xsl:apply-templates select="child::*" mode="children-header" />
		</tr>
	</xsl:template>

	<xsl:template match="attribute::*" mode="attributes-header" priority="0">
		<xsl:variable name="nextpos" select="position()+1" />
		<xsl:if test="not(starts-with(substring(name(.), 2), '-'))">
			<th>
				<xsl:if test="position() = 1">
					<xsl:attribute name="class">
						<xsl:text>titlecolumn</xsl:text>
					</xsl:attribute>
				</xsl:if>
				<xsl:value-of select="name(.)" />
			</th>
		</xsl:if>
	</xsl:template>
	<xsl:template match="child::*" mode="children-header" priority="0">
		<th class="noVis">
			<xsl:value-of select="name(.)" />
		</th>
	</xsl:template>
	<xsl:template match="child::*[1]" mode="details-control-header">
		<th class="details-control"><!-- details --></th>
	</xsl:template>

	<!-- RUN THROUGHT ATTRIBUTES: fill in values -->
	<xsl:template match="child::*" mode="autovalues">
		<tr id="{@id}">
			<xsl:apply-templates select="child::*[1]" mode="details-control-values" />

			<xsl:apply-templates select="attribute::*" mode="attributes-values">
				<xsl:sort select="position()" order="ascending" data-type="number" />
			</xsl:apply-templates>

			<xsl:apply-templates select="child::*" mode="children-values" />
		</tr>
	</xsl:template>
	<xsl:template match="attribute::*" mode="attributes-values" priority="0">
		<xsl:if test="not(starts-with(substring(name(.), 2), '-'))">
			<td>
				<xsl:value-of select="." />
				<xsl:variable name="nextpos" select="position()+1" />
				<xsl:if test="(starts-with(substring(name(./parent::*/@*[position()=$nextpos]), 2), '-'))">
					<xsl:if test="string-length(./parent::*/@*[position()=$nextpos])">
						<span class="inline">
							<xsl:text>(</xsl:text>
							<xsl:value-of select="./parent::*/@*[position()=$nextpos]" />
							<xsl:text>)</xsl:text>
						</span>
					</xsl:if>
				</xsl:if>
				<xsl:if test="(starts-with(substring(name(./parent::*/@*[position()=$nextpos]), 2), '+'))">
					<xsl:if test="string-length(./parent::*/@*[position()=$nextpos])">
						<span class="inline">
							<xsl:text> </xsl:text>
							<xsl:value-of select="./parent::*/@*[position()=$nextpos]" />
						</span>
					</xsl:if>
				</xsl:if>
			</td>
		</xsl:if>
	</xsl:template>
	<xsl:template match="child::*" mode="children-values" priority="0">
		<td>
			<xsl:value-of select="." />
		</td>
	</xsl:template>
	<xsl:template match="child::*[1]" mode="details-control-values">
		<td><!-- details --></td>
	</xsl:template>
	
	<!-- AUTO OVERRIDE some common headers........................................................... -->
	<xsl:template match="@id" mode="attributes-header">
		<!--<xsl:attribute name="id">
			<xsl:value-of select="." />
		</xsl:attribute>-->
	</xsl:template>
	<xsl:template match="@id" mode="attributes-values">
		<!--<xsl:value-of select="." />-->
	</xsl:template>

</xsl:stylesheet>
